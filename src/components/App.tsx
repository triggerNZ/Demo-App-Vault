import React, {Component} from 'react'; // we need this to make JSX compile
import * as state from '../state'
import { MedicalInformation } from './MedicalInformation';
import { modLens, modOptional } from '../lens';
import { ItemService, Environment, AuthData, UserService, vaultAPIFactory } from "@meeco/sdk";
import { Login } from './Login';
import * as meeco from '../meeco'

export class App extends Component<{env: Environment, savedAuthData? : AuthData}, state.AppState> {
    private env: Environment;
    
    constructor(props: {env: Environment, savedAuthData? : AuthData}) {
        super(props);
        this.env = props.env;
        console.log('App loaded');
        if (!props.savedAuthData) {
            this.state = state.notLoggedInState(false);
        } else {
            this.state = state.loadingDataState(props.savedAuthData);
            this.loadData(props.savedAuthData);
        }
        
    }

    render() {
        switch(this.state.kind) {
            case "logged-in":
                let medical = this.state.medical;
                let auth = this.state.authData;
                return <div>
                        <MedicalInformation 
                            info={medical} 
                            onDoctorContactEdit={ (s) => this.modState(st => state.rootDoctorContactO.setOptional(st, s)) } 
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
                            <button className="primary large" onClick={() => this.persistState(auth, medical)}>Save</button>
                            </div>
        
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

    async persistState(auth: AuthData, med: state.MedicalInformationState): Promise<void> {
        let vaf = vaultAPIFactory(this.env)(auth)
        const itemApi = vaf.ItemApi;
        const templateApi = vaf.ItemTemplateApi;
        const itemService = new ItemService(this.env, logger);
        let templates = await templateApi.itemTemplatesGet();
        let existingTemplate = templates.item_templates.filter(t => t.name === meeco.TEMPLATE_NAME);
        let healthInfoTemplate = existingTemplate[0]

        if (!healthInfoTemplate) {
            healthInfoTemplate= (await templateApi.itemTemplatesPost(meeco.template)).item_template;
            console.log('newTemplate', healthInfoTemplate);
        } else {
            console.log('template already exists', healthInfoTemplate)
        }
        await itemService.create(
            auth.vault_access_token, auth.data_encryption_key, meeco.createMedicalInfo(healthInfoTemplate.name, med));
        console.log("successfully saved")
    }

    modState(fn: (s: state.AppState) => state.AppState): void {
        console.log("state before", this.state);
        this.setState(fn(this.state));
        console.log("state after", fn(this.state));
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
            window.localStorage.setItem('savedAuth', JSON.stringify(authData));
            this.setState(state.loadingDataState(authData));
            await this.loadData(authData);
        } catch (error) {
            this.setState(state.notLoggedInState(true));
        }
    }

    async loadData(authData: AuthData): Promise<void> {
        const itemService = new ItemService(this.env, logger);
        let allItems = await  itemService.list(authData.vault_access_token);
        console.log('allItems', allItems);
        let latestItem = 
            maxBy(
                allItems.items.
                    filter(it => it.name === "health_information"),
                it => it.created_at.toISOString()    
            )
        console.log(latestItem);
        
        let actualItem = await itemService.get(latestItem.id, authData.vault_access_token, authData.data_encryption_key)

        console.log(actualItem);

        const medInfo = meeco.loadMedicalInfo(actualItem.slots)

        this.setState(state.initialLoggedInState(authData, medInfo));
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