export class Notification {
    companyId: number = 0;
    resaleId: number = 0;
    id: string = "";

    origUserId: number = 0;
    origUserName: string = "";
    origDate: Date | string = "";
    origRoleId: number = 0;
    origRoleDesc: string = "";
    origNotificationMenu: string = "";

    destUserId: number = 0;
    destUserRoleId: number = 0;
    destUseAll: string = "";

    vehicleId: number = 0;
    budgetId: number = 0;
    purchaseOrderId: number = 0;
    toolControlRequestId: number = 0;

    header: string = "";
    message1: string = "";
    message2: string = "";
    message3: string = "";
    shareMessage: string = "";
    deleteMessage: string = "";
}