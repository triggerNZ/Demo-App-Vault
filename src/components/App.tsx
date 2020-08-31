import React, {Component} from 'react'; // we need this to make JSX compile
import * as state from '../state'
import { MedicalInformation } from './MedicalInformation';
import { modOptional, Optional, ol } from '../lens';
import { ItemService, Environment, AuthData, UserService, vaultAPIFactory, ShareService, ConnectionService } from "@meeco/sdk";
import { Login } from './Login';
import * as meeco from '../meeco'
import { Tabs } from './Tabs';
import { FeelingToday } from './FeelingToday';
import { CovidDiary } from './CovidDiary';
import {PostFastItemTemplateRequest, ItemTemplateWithoutAssociations, Item, Share, MeResponse} from '@meeco/vault-api-sdk'
import { Invite } from './Invite';
import { Sharing } from './Sharing';

export class App extends Component<{env: Environment, savedAuthData? : AuthData}, state.AppState> {
    private env: Environment;
    
    constructor(props: {env: Environment, savedAuthData? : AuthData}) {
        super(props);
        this.env = props.env;
        console.log('App loaded');
        if (!props.savedAuthData) {
            this.state = state.notLoggedInState(false);
        } else {
            console.log(props.savedAuthData);
            this.state = state.loadingDataState(props.savedAuthData);
            this.loadData(props.savedAuthData);
        }
    }

    render() {
        switch(this.state.kind) {
            case "logged-in": {
                let loggedIn: state.LoggedIn = this.state;
                let medical = loggedIn.medical;
                let auth = loggedIn.authData;
                
                let tabs = <Tabs currentTab={loggedIn.currentTab} onChange={(newTab) => this.setState({...this.state, currentTab: newTab}) }></Tabs>;
                
                let mainScreen: JSX.Element;
                switch (loggedIn.currentTab) {
                    case state.CurrentTab.Medical:
                        mainScreen = <div>
                        <MedicalInformation 
                            editable={true}
                            info={medical} 
                            editingName={medical.editingName}
                            onNameEdit = {(s) => this.modState(st => state.rootNameO.setOptional(st, s))}

                            onDoctorContactEdit={(s) => this.modState(st => state.rootDoctorContactO.setOptional(st, s)) } 
                            editingDoctor={medical.editingDoctor}
                            toggleEditingDoctor={() => this.modState(st => modOptional(state.rootEditingDoctorO, st, b => !b)) }
                            
                            onPersonalContactEdit={(s) => this.modState(st => state.rootPersonalContactO.setOptional(st, s)) }
                            editingPersonal={medical.editingPersonal}
                            toggleEditingPersonal={() => this.modState(st => modOptional(state.rootEditingPersonalO, st, b => !b)) }
                            
                            editingMedications = {medical.editingMedications}
                            onMedicationsEdit={(ms) => this.modState(st => state.rootMedicationsO.setOptional(st, ms))}
                            toggleEditingMedications={() => this.modState(st => modOptional(state.rootEditingMedicationsO, st, b => !b)) }
                            
                            editingConditions = {medical.editingConditions}
                            onConditionsEdit={(cs) => this.modState(st => state.rootConditionsO.setOptional(st, cs))}
                            toggleEditingConditions={() => this.modState(st => modOptional(state.rootEditingConditionsO, st, b => !b)) }
                            toggleEditingName = {() => this.modState(st => modOptional(state.rootEditingNameO, st, b => !b))}
                            />
                            <button className="primary large" onClick={() => this.persistMedical(auth, medical)}>Save</button>
                           
                    </div>
                    break;
                    case state.CurrentTab.FeelingToday:
                        mainScreen = 
                        <FeelingToday 
                            selected={this.state.currentFeeling}
                            currentDate={new Date()}
                            onChange={this.setStateO(state.rootCurrentFeelingO)}
                            onSave={() => {
                                this.saveFeelingToLog(loggedIn);
                                this.modState(s => state.rootCurrentTabO.setOptional(s, state.CurrentTab.CovidDiary))
                            }} />
                        break;
                    case state.CurrentTab.CovidDiary:
                        mainScreen = <CovidDiary diary={loggedIn.covidDiary}/>
                        break;
                    case state.CurrentTab.Invite:
                        mainScreen = <Invite 
                            currentInvitation={loggedIn.sentInvite}
                            newInviteName={loggedIn.newInviteName}
                            onChangeNewInviteName={this.setStateO(state.rootNewInviteNameO)}
                            
                            acceptInvite={loggedIn.acceptInvite}
                            onChangeAcceptInvite={this.setStateO(state.rootCurrentInviteO)}
                            
                            onInvite={() => this.onInvite(loggedIn.authData, loggedIn.newInviteName)}
                            
                            onAcceptInvite={() => this.onAcceptInvite(loggedIn.authData, loggedIn.acceptInvite)}
                            
                        /> 
                        break;   
                    case state.CurrentTab.Sharing:
                        {
                        mainScreen = <Sharing 
                            connections={loggedIn.connections} 
                            sharedWithMe={loggedIn.sharedWithMe}
                            sharedWithThem={loggedIn.sharedWithThem}
                            myUserId={loggedIn.user.user.id}
                            onShare={c => this.onShare(loggedIn.authData, c, loggedIn.medical.itemId)}
                            />
                        }
                        break;   
                }
    
                return <div>{tabs}{mainScreen}</div>
            }
        
            case "logging-in":
                return <div>
                    <div></div>
                    <h5>Logging in. Please wait a moment...</h5>
                </div>

            case "loading-data":
                return <div>
                    <div></div>
                    <h5>Loading data. Please wait a moment...</h5>
                </div>

            case "not-logged-in": {
                const secret = this.state.secret;
                const passphrase = this.state.passphrase;
                return <Login 
                    lastLoginFailed={this.state.lastLoginFailed}
                    secret={secret} 
                    passphrase={this.state.passphrase} 
                    onUpdate={(s, p) => this.setState({...this.state, secret: s, passphrase: p})}
                    onLoginClicked={() => this.doLogin(secret, passphrase)}/>
            }
        }
    }

    async onShare(authData: AuthData, c: state.ConnectionWithName, medicalInfoShareableId: string) {
        const shareService = new ShareService(this.env, logger)
        let sharedItem = await shareService.shareItem(
            authData,
            c.connection.id,
            medicalInfoShareableId
        )
        console.log(sharedItem)
    }

    async onAcceptInvite(authData: AuthData, acceptInvite: {name: string, token: string}) {
        const connectionService = new ConnectionService(this.env, logger)
        const connection =  await connectionService.acceptInvitation(acceptInvite.name, acceptInvite.token, authData);
        console.log('created connection', connection);
    }

    async onInvite(authData: AuthData, name: string): Promise<void> {
        const connectionService = new ConnectionService(this.env, logger)
        let invitation = await connectionService.createInvitation(name, authData)
    
        this.setStateO(ol(state.rootLoggedInO, state.loggedInSentInviteL))(invitation)
        console.log('invite sent', invitation)
    }

    async saveFeelingToLog(lis: state.LoggedIn): Promise<void> {
        console.log("Saving feeling")
        const curDiary = lis.covidDiary;
        let updatedDiary: state.CovidDiary;

        if (lis.currentFeeling === undefined) {
            updatedDiary = curDiary;
        } else {
            updatedDiary = [...curDiary, {date: new Date(), feeling: lis.currentFeeling}]
        }
        console.log('updatedDiary:', updatedDiary)
        this.setState({...lis, covidDiary: updatedDiary, currentFeeling: undefined})
        await this.persistDiary(lis.authData, updatedDiary);
    }

    async getOrCreateTemplate(auth: AuthData, name: string, template: PostFastItemTemplateRequest): Promise<ItemTemplateWithoutAssociations> {
        let vaf = vaultAPIFactory(this.env)(auth)
        const itemApi = vaf.ItemApi;
        const templateApi = vaf.ItemTemplateApi;
        const itemService = new ItemService(this.env, logger);
        let templates = await templateApi.itemTemplatesGet();
        let existingTemplate = templates.item_templates.filter(t => t.name === name);
        let healthInfoTemplate = existingTemplate[0]
        
        if (!healthInfoTemplate) {
            healthInfoTemplate= (await templateApi.itemTemplatesPost(template)).item_template;
            console.log('newTemplate', healthInfoTemplate);
        } else {
            console.log('template already exists', healthInfoTemplate)
        }
        return healthInfoTemplate
    }

    async persistDiary(auth: AuthData, diary: state.CovidDiary): Promise<void> {
        const itemService = new ItemService(this.env, logger);
        const template = await this.getOrCreateTemplate(auth, meeco.DIARY_TEMPLATE_NAME, meeco.diaryTemplate);
        await itemService.create(
            auth.vault_access_token, auth.data_encryption_key, meeco.createDiary(template.name, diary));
        console.log("successfully saved")
    }

    async persistMedical(auth: AuthData, med: state.MedicalInformationState): Promise<void> {
        const itemService = new ItemService(this.env, logger);
        const template = await this.getOrCreateTemplate(auth, meeco.MEDICAL_TEMPLATE_NAME, meeco.medicalTemplate);
        await itemService.create(
            auth.vault_access_token, auth.data_encryption_key, meeco.createMedicalInfo(template.name, med));
        console.log("successfully saved")
    }

    modState(fn: (s: state.AppState) => state.AppState): void {
       this.setState((oldState) => fn(oldState))
    }

    setStateO<V>(o: Optional<state.AppState, V>): (newValue: V) => void {
        return (newValue) => this.setState(oldState => o.setOptional(oldState, newValue))
    }

    async doLogin(secret: string, passphrase: string) {
        this.setState(state.loggingInState());
        const usersService = new UserService(this.env, logger);
        try {
            const authData = await usersService.get(
                passphrase,
                secret
            ); 
            console.log("Got user", authData);
            console.log('savong', JSON.stringify(authData))
            window.localStorage.setItem('savedAuth', JSON.stringify(authData));
            this.setState(state.loadingDataState(authData));
            await this.loadData(authData);
        } catch (error) {
            this.setState(state.notLoggedInState(true));
        }
    }

    async latestItem(authData: AuthData, itemName: String): Promise<Item | undefined> {
        const itemService = new ItemService(this.env, logger);
        let allItems = await itemService.list(authData.vault_access_token);
        let latestItem = 
            maxBy(
                allItems.items.
                    filter(it => it.label === itemName),
                it => it.created_at.toISOString()
            )
       return latestItem
    }

    async loadData(authData: AuthData): Promise<void> {
        let shareService = new ShareService(this.env)
        let user = await this.loadUser(authData)
        let connections = await this.loadConnections(authData);
        let shares = await this.loadShares(authData)

        console.log('got shares', shares)

        let medical = await this.loadMedical(authData)
        console.log('final medical', medical)
        let diary = await this.loadDiary(authData)
        console.log('final diary', diary)

        let swm: Record<state.ConnectionId, state.MedicalInformation> = {}
        let swt: state.ConnectionId[] = []

        for(let c of connections) {
            let withMe = sharedWithMe(c, shares, user.user.id)
            console.log('withMe', withMe)
            if (withMe) {
                let item = await shareService.getSharedItem(authData, withMe.id)
                console.log('item', item)
                let medical = meeco.loadMedicalInfo(item.item.id, item.slots)
                console.log('medical', medical)
                swm[c.connection.id] = medical
            }
            let withOthers = sharedWithThem(c, shares)
            if (withOthers) {
                swt.push(c.connection.id)
            }
        }

        this.setState(state.initialLoggedInState(authData, user, medical, diary, connections, swm, swt))
    }
    
    async loadShares(authData: AuthData): Promise<Share[]> {
        let shareService = new ShareService(this.env)
        let allShares = await shareService.listShares(authData);
        return allShares.shares;
    }

    async loadMedical(authData: AuthData): Promise<state.MedicalInformation | null> {
        const itemService = new ItemService(this.env, logger);
        let latestItem = await this.latestItem(authData, meeco.MEDICAL_ITEM_NAME);
        console.log('loadMedical', 'latestItem', latestItem)
        if (latestItem) {
            let actualItem = await itemService.get(latestItem.id, authData.vault_access_token, authData.data_encryption_key)
            console.log('loadMedical', 'Actual Item', actualItem);
            const medInfo = meeco.loadMedicalInfo(actualItem.item.id, actualItem.slots)
            return medInfo;
        } else {
            console.log('loadMedical', 'returning null');
            return null;
        }
    }

    async loadConnections(authData: AuthData): Promise<state.ConnectionWithName[]> {
        const connectionService = new ConnectionService(this.env, logger)
        let connections = await connectionService.listConnections(authData)
        console.log('connections', connections)
        return connections as state.ConnectionWithName[];
    }

    async loadUser(authData: AuthData): Promise<MeResponse> {
        const userService = new UserService(this.env, logger)
        return userService.getVaultUser(authData.vault_access_token)
    }
    

    async loadDiary(authData: AuthData): Promise<state.CovidDiary | null> {
        const itemService = new ItemService(this.env, logger);
        let latestItem = await this.latestItem(authData, meeco.DIARY_ITEM_NAME);
        console.log('loadDiary', 'latestItem', latestItem)
        if (latestItem) {
            let actualItem = await itemService.get(latestItem.id, authData.vault_access_token, authData.data_encryption_key)
            console.log('loadDiary', 'Actual Item', actualItem);
            const diary = meeco.loadDiary(actualItem.slots)
            return diary;
        } else {
            console.log('loadDiary', 'returning null');
           return null;
        }
    }
}


function maxBy<A>(arr: A[], compareBy: (a: A) => string): A | undefined {
    if (arr.length == 0) {
        return undefined;
    } else {
        let max = arr[0];
        let fMax = compareBy(max);

        for (let i = 0; i < arr.length; i++) {
            if (compareBy(arr[i]) > fMax) {
                fMax = compareBy(arr[i]);
                max = arr[i];
            }
        }
        return max;
    }
}

const logger: (msg: string) => void = (msg) => console.log(msg)

function sharedWithMe(c: state.ConnectionWithName, shares: Share[], myId: string): Share | undefined {
    return shares.find(s => s.connection_id === c.connection.id && s.recipient_id === myId)
}   

function sharedWithThem(c: state.ConnectionWithName, shares: Share[]): Share | undefined {
    return shares.find(s => s.connection_id === c.connection.id && s.recipient_id === c.connection.user_id)
}   