import {ol} from '../src/lens';
import * as state from '../src/state';
import {expect} from 'chai';
import { AuthData, EncryptionKey } from '@meeco/sdk';
import { MeResponse} from '@meeco/vault-api-sdk'
import { modOptional } from '../src/lens';

const blankAuth: AuthData = new AuthData({
    data_encryption_key: EncryptionKey.fromRaw(''),
    key_encryption_key: EncryptionKey.fromRaw(''),
    keystore_access_token: '',
    passphrase_derived_key: EncryptionKey.fromRaw(''),
    secret: '',
    vault_access_token: ''
})

const blankUser: MeResponse = {
  user: {
    id: "1",
    full_name: "Lenny Leftie",
    email: "",
    is_app_logging_enabled: false,
    image: "",
    country: "AU",
    track_usage: false,
    joined_at: new Date(),
    timezone: "UTC",
    track_events: false,
    onboarded_at: new Date(),
    verified_at: new Date(),
    share_terms: "",
    cloudname: "nimbostratus",
    key_store_admission_token: "",
    key_store_id: "",
    key_store_url: "",
    key_store_username: "",
    using_key_store: true,
    using_shadow_key: false,
    api_set_key_store_passphrase: new Date(),
    queued_for_deletion_after: new Date(),
    encryption_engine_admission_token: "",
    private_encryption_space_id: "",
    accepted_terms: true,
    association_ids: [],
    using_api_set_key_store_passphrase: true,
    unconfirmed_email: ""
  },
  associations: []
}

describe('State modifications', () => {
    it('Edit doctor name', () => {
      let initial = state.initialLoggedInState(blankAuth, blankUser, state.blankMedInfo, [], [], {}, [])
      let updated = ol(state.rootDoctorContactO, state.contactNameL).setOptional(initial, "Tin");
      expect((updated as state.LoggedIn).medical.doctorContact.name).equal("Tin")
    });
    it('Edit editing doctor name', () => {
        let initial = state.initialLoggedInState(blankAuth, blankUser, state.blankMedInfo, [], [], {}, [])
        let updated = modOptional(state.rootEditingDoctorO, initial, (b) => !b)
        expect((updated as state.LoggedIn).medical.editingDoctor).equal(true);
      });
    it('Edit contact relationship', () => {
        let initial = state.initialLoggedInState(blankAuth, blankUser, state.blankMedInfo, [], [], {}, [])
        let updated = ol(state.rootPersonalContactO, state.personalRelationshipL).setOptional(initial, "Wife")
        expect((updated as state.LoggedIn).medical.personalContact.relationship).equal("Wife");
      });
  });