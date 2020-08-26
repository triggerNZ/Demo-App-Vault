import React, {Component} from 'react'; // we need this to make JSX compile
import * as state from '../state'
import { MedicalInformation } from './MedicalInformation';
import { modOptional } from '../lens';
import { ItemService, Environment, AuthData, UserService, vaultAPIFactory } from "@meeco/sdk";
import { Login } from './Login';
import * as meeco from '../meeco'
import { Tabs } from './Tabs';
import { FeelingToday } from './FeelingToday';
import { CovidDiary } from './CovidDiary';
import {PostFastItemTemplateRequest, ItemTemplateWithoutAssociations, Item} from '@meeco/vault-api-sdk'
import { Share } from './Share';

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
                            info={medical} 
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
                            
                            />
                            <button className="primary large" onClick={() => this.persistMedical(auth, medical)}>Save</button>
                           
                    </div>
                    break;
                    case state.CurrentTab.FeelingToday:
                        mainScreen = 
                        <FeelingToday 
                            selected={this.state.currentFeeling}
                            currentDate={new Date()}
                            onChange={(f) => this.modState(s => state.rootCurrentFeelingO.setOptional(s, f))}
                            onSave={() => {
                                this.saveFeelingToLog(loggedIn);
                                this.modState(s => state.rootCurrentTabO.setOptional(s, state.CurrentTab.CovidDiary))
                            }} />
                        break;
                    case state.CurrentTab.CovidDiary:
                        mainScreen = <CovidDiary diary={loggedIn.covidDiary}/>
                        break;
                    case state.CurrentTab.Sharing:
                        mainScreen = <Share userId="tin"/> 
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
        let medical = await this.loadMedical(authData)
        console.log('final medical', medical)
        let diary = await this.loadDiary(authData)
        console.log('final diary', diary)
        this.setState(state.initialLoggedInState(authData, medical, diary))
    }

    async loadMedical(authData: AuthData): Promise<state.MedicalInformation | null> {
        const itemService = new ItemService(this.env, logger);
        let latestItem = await this.latestItem(authData, meeco.MEDICAL_ITEM_NAME);
        console.log('loadMedical', 'latestItem', latestItem)
        if (latestItem) {
            let actualItem = await itemService.get(latestItem.id, authData.vault_access_token, authData.data_encryption_key)
            console.log('loadMedical', 'Actual Item', actualItem);
            const medInfo = meeco.loadMedicalInfo(actualItem.slots)
            return medInfo;
        } else {
            console.log('loadMedical', 'returning null');
            return null;
        }
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