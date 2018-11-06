export class Tenant {
  private c_name: string;
  private userMail: string;
  private c_id: string;
  private address: string;
  private objectURI: string;
  private c_image: string;

  constructor();
  constructor(c_name?: string, c_id?: string, userMail?: string, address?: string, objectURI?: string, c_image?: string) {
    this.c_name = c_name || '';
    this.c_id = c_id || '';
    this.userMail = userMail || '';
    this.address = address || '';
    this.objectURI = objectURI || '';
    this.c_image = c_image || '';
  }
}
