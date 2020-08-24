import {ol} from '../src/lens';
import * as state from '../src/state';
import {expect} from 'chai';
import { AuthData, EncryptionKey } from '@meeco/sdk';
import { modOptional } from '../src/lens';

const blankAuth: AuthData = new AuthData({
    data_encryption_key: EncryptionKey.fromRaw(''),
    key_encryption_key: EncryptionKey.fromRaw(''),
    keystore_access_token: '',
    passphrase_derived_key: EncryptionKey.fromRaw(''),
    secret: '',
    vault_access_token: ''
})


describe('State modifications', () => {
    it('Edit doctor name', () => {
      let initial = state.initialLoggedInState(blankAuth, state.blankMedInfo)
      let updated = ol(state.rootDoctorContactO, state.contactNameL).setOptional(initial, "Tin");
      expect((updated as state.LoggedIn).medical.doctorContact.name).equal("Tin")
    });
    it('Edit editing doctor name', () => {
        let initial = state.initialLoggedInState(blankAuth, state.blankMedInfo)
        let updated = modOptional(state.rootEditingDoctorO, initial, (b) => !b)
        expect((updated as state.LoggedIn).medical.editingDoctor).equal(true);
      });
    it('Edit contact relationship', () => {
        let initial = state.initialLoggedInState(blankAuth, state.blankMedInfo)
        let updated = ol(state.rootPersonalContactO, state.personalRelationshipL).setOptional(initial, "Wife")
        expect((updated as state.LoggedIn).medical.personalContact.relationship).equal("Wife");
      });
  });