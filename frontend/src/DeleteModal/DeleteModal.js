import React, {useState} from "react";
import {Button, Modal} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import axios from "axios"
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        position: 'absolute',
        width: 550,
        height: 200,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    modalButtons: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        width: 450,
        height: 100
    }
}));

function DeleteModal(props) {
    const [modalState, setState] = useState(false);
    const classes = useStyles();
    
    const handleOpen = () => {
        setState(true)
    };

    const handleClose = () => {
        setState(false)
    };

    const handleDelete = async () => {
        const result = await axios.delete('/api/v1/vault/delete_vault/', {params: {id: props.itemId}});
        if (result.status === 200) {
            console.log("delete successful");
            props.setState({
                ...props.vaultState,
                updated: true
            });
            handleClose();
        }
    };

    const modalBody = (
        <div className={classes.paper}>
            <Typography variant={'h5'} align={'center'}>
                Are you sure you want to delete this entry?
            </Typography>
            <div className={classes.modalButtons}>
                <Button variant={'contained'} size={'medium'} onClick={handleDelete}>
                    Delete
                </Button>
                <Button variant={'contained'} size={'medium'} onClick={handleClose}>
                    Cancel
                </Button>
            </div>
        </div>
    );
    
    return(
        <div>
            <IconButton color="primary" aria-label="delete" onClick={handleOpen}>
                <Delete/>
            </IconButton>
            <Modal open={modalState} onClose={handleClose} className={classes.modal}>
                {modalBody}
            </Modal>
        </div>
    )
}

export default DeleteModal;
