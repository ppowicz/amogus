export default interface IMenuItem {
    id?: number;
    name: string;
    description: string;
    image_url: string;
    price: number;
    amount?: number;
}

export const menuItemEmpty: IMenuItem = { name: '', description: '', price: 0, image_url: '' };