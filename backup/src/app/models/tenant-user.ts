export class TenantUser {
     private userName: string;
     private userMail: string;
     private userRole: string;
     private userStatus: string;
     private firstName: string;
     private lastName: string;
     private phoneNumber: string;
     private userAddress: string;
     private objectURI: string;
     private c_image: string;

     constructor();
     constructor(userName?: string, userMail?: string, userRole?: string, userStatus?: string, firstName?: string, lastName?: string, phoneNumber?: string, userAddress?: string, objectURI?: string, c_image?: string) {
          this.userName = userName || '';
          this.userMail = userMail || '';
          this.userRole = userRole || '';
          this.userStatus = userStatus || '';
          this.firstName = firstName || '';
          this.lastName = lastName || '';
          this.phoneNumber = phoneNumber || '';
          this.userAddress = userAddress || '';
          this.objectURI = objectURI || '';
          this.c_image = c_image || '';
     }
}
