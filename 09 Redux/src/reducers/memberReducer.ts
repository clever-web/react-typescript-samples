import MemberEntity from "../api/memberEntity";
import MemberAPI from "../api/memberAPI";
import objectAssign = require('object-assign');
import MemberFormErrors from "../validations/memberFormErrors"
import MemberFormValidator from "../validations/memberFormValidator"


let emptyMemberEntity = new MemberEntity();

class MemberState  {
  member : MemberEntity;
  memberId : number;
  errors : MemberFormErrors;
  isValid : boolean;

  public constructor()
  {
    this.member = new MemberEntity();
    this.memberId = -1;
    this.errors = new MemberFormErrors();
    this.isValid = false;
  }
}


// Just to show how combine reducers work, we have
// divided into two reducers member load + member load/update/delete
export default (state : MemberState = new MemberState(), action) => {
  let newState : MemberState = null;

  switch (action.type) {
    case 'MEMBER_LOAD':
      let member : MemberEntity;
      let memberId : number = action["id"];

      member = MemberAPI.getMemberById(memberId);
      newState = objectAssign({}, state, {dirty: false, member: member, errors: new MemberFormErrors(), isValid: true});

      return newState;

    /*case 'MEMBER_DIRTY':

      newState = objectAssign({}, state, {dirty: action["dirty"]});
      return newState;
    */
    case 'MEMBER_UI_INPUT':
    //Temporary hack, to force creating a new object (just temporary)
    // TODO: enhance this
    // We should just treat single UI input (validate on field, check if )
    // it has to be included here, ideally not
      let memberUIUpdated : MemberEntity = JSON.parse(JSON.stringify(action["member"]));

      newState = objectAssign({}, state, {member: memberUIUpdated});
      return newState;

    case 'MEMBER_VALIDATE':
        let memberToValidate : MemberEntity = action["member"];

        let errors : MemberFormErrors = MemberFormValidator.validateMember(member);

        newState = objectAssign({}, state, {member: member, isValid: errors.isEntityValid, errors: errors});
        return newState;

    case 'MEMBER_SAVE':
      let errorsSave : MemberFormErrors = MemberFormValidator.validateMember(state.member);

      if(errorsSave.isEntityValid == true) {
        MemberAPI.saveAuthor(state.member);
        // TODO: pending clone member object !! (keep state inmmutable)
        newState = objectAssign({}, state, {isValid: true, errors: new MemberFormErrors()});
      } else {
        newState = objectAssign({}, state, {isValid: errors.isEntityValid, errors: errors});
      }


      return newState;

    default:
      return state;
  }

};
