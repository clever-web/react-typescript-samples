import * as React from 'react';
import { Link } from 'react-router-dom';
import { MemberEntity } from '../../model';
import { MemberHeader } from './memberHeader';
import { MemberRow } from './memberRow';

export interface Props {
  members: MemberEntity[];
  fetchMembers(): void;
}

export class MembersPage extends React.Component<Props,{}> {
  constructor(props) {
    super(props);
    this.state = { members: [] };
  }
  public componentDidMount() {
    this.props.fetchMembers();
  }

  public render() {
    return (
      <div className="row">
        <h2> Members Page</h2>
        <Link to="/member">New Member</Link>
        <table className="table">
          <thead>
            <MemberHeader />
          </thead>
          <tbody>
            {
              this.props.members.map((member) =>
                <MemberRow
                  key={member.id}
                  member={member}
                />
              )
            }
          </tbody>
        </table>
      </div>
    );
  }
};
