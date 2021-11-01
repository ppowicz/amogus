import React, { useState } from 'react';
import { Button, CircularProgress, IconButton, Typography } from '@mui/material';
import { apiPaths, invoke, queryClient, useApi } from '../../api';
import MenuItem from '../../components/MenuItem';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import EditItemPopup from '../../components/Admin/EditItemPopup';
import IMenuItem, { menuItemEmpty } from '../../interfaces/IMenuItem';
import { useMutation } from 'react-query';

export default function MenuManagement() {
    const menu = useApi(apiPaths.menu);

    const [type, setType] = useState<'add' | 'edit'>('add');
    const [popupOpen, setPopupOpen] = useState(false);
    const [currItem, setCurrItem] = useState<IMenuItem>(menuItemEmpty);

    const openEditPopup = (item: IMenuItem) => {
        setCurrItem(item);
        setType('edit');
        setPopupOpen(true);
    }

    const openAddPopup = () => {
        setCurrItem(menuItemEmpty);
        setType('add');
        setPopupOpen(true);
    }

    const addMutation = useMutation(apiPaths.addMenuItem.path, (data: IMenuItem) => invoke(apiPaths.addMenuItem, data), {
        onSuccess: () => queryClient.invalidateQueries(apiPaths.menu.path)
    });
    const editMutation = useMutation(apiPaths.editMenuItem.path, (data: IMenuItem) => invoke(apiPaths.editMenuItem, data), {
        onSuccess: () => queryClient.invalidateQueries(apiPaths.menu.path)
    });

    const deleteMutation = useMutation(apiPaths.deleteMenuItem.path,
        (data: IMenuItem) => invoke(apiPaths.deleteMenuItem.with('id', (data.id || '').toString())),
        {
            onSuccess: () => queryClient.invalidateQueries(apiPaths.menu.path)
        });

    return <>
        <EditItemPopup key={currItem?.id || '!'} type={type}
                       item={currItem}
                       open={popupOpen} onClose={() => setPopupOpen(false)}
                       onSubmit={type === 'edit' ? editMutation.mutate : addMutation.mutate}
                       isLoading={type === 'edit' ? editMutation.isLoading : addMutation.isLoading}
        />
        <Typography variant='h4' sx={{ mb: 2 }}>Menu management</Typography>
        <Button variant='contained' onClick={openAddPopup}>New item</Button>
        <Grid container spacing={3} sx={{ mt: 3 }}>
            {menu.isSuccess ?
                menu.data.map(item => {
                    return <Grid item xs key={item.id}>
                        <MenuItem item={item}>
                            <IconButton color="success" onClick={() => openEditPopup(item)}><EditIcon/></IconButton>
                            <IconButton color="error" onClick={() => deleteMutation.mutate(item)}>
                                {deleteMutation.isLoading ? <CircularProgress size={24}/> :
                                    <DeleteIcon/>}
                            </IconButton>
                        </MenuItem>
                    </Grid>
                })
                :
                <></>
            }
        </Grid>
    </>;
}