import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import LoadingButton from '@mui/lab/LoadingButton';
import React, { useState } from 'react';
import IMenuItem from '../../interfaces/IMenuItem';
import { Box, Button } from '@mui/material';

type Props = {
    type: 'add' | 'edit',
    item: IMenuItem,
    open: boolean,
    onClose: () => void,
    onSubmit: (item: IMenuItem) => void,
    isLoading: boolean,
}

export default function EditItemPopup({ open, onClose, type, item, onSubmit, isLoading }: Props) {
    const [data, setData] = useState(item);

    const update = (key: keyof IMenuItem, val: any) => setData(p => ({ ...p, [key]: val }));

    const fieldStyle = { mb: 2, width: '100%' };

    const field = (id: keyof IMenuItem, label: string, props?: Partial<TextFieldProps>) =>
        <TextField sx={fieldStyle}
                   label={label}
                   value={data[id]}
                   onChange={e => update(id, e.target.value)}
                   {...props}
        />;

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle>{type === 'add' ? 'Add new item' : 'Edit item'}</DialogTitle>
        <DialogContent>
            <Box sx={{ px: 0, py: 1, minWidth: '400px' }} component='form'>
                {field('name', 'Name')}
                {field('description', 'Description', { multiline: true })}
                {field('price', 'Price', { type: 'number', inputProps: { inputMode: 'numeric', pattern: '[0-9]*' } })}
                {field('image_url', 'Image URL')}
            </Box>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <LoadingButton onClick={() => onSubmit(data)} loading={isLoading}>Submit</LoadingButton>
            </DialogActions>
        </DialogContent>
    </Dialog>

}