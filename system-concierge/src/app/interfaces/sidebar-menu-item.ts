export interface SideBarMenuItem {

    title:string;
    label?:string, 
    icon?:string, 
    routerlink?:string
    itens: SideBarMenuItem[];
}
