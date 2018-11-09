export class Users {
     private userMail: string;
     private userRole: string;
     private userName: string;
     private userId: string;

     constructor(userMail: string, userRole: string, userName: string, userId: string) {
          this.userMail = userMail;
          this.userRole = userRole;
          this.userName = userName;
          this.userId = userId;
     }
}
