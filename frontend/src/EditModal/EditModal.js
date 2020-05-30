import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Modal} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button";
import db from "../VaultDb";
import axios from "axios";
import AES from "crypto-js/aes";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import './EditModal.css'

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        position: 'absolute',
        width: 500,
        height: 500,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    textField: {
        paddingTop: '25px',
        width: '50%'
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'center'
    },
    button: {
        position: 'fixed',
        right: '4%',
        bottom: '3%'
    },
    focus: {
        outline: 'none'
    }
}));

function EditModal(props) {
    const classes = useStyles();
    const [modalData, setData] = useState({
        domain: props.domain,
        username: props.username,
        password: props.password
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleClose = () => {
        props.setModalState(false)
    };

    const handleChange = (evt) => {
        const value = evt.target.value;
        setData({
            ...modalData,
            [evt.target.name]: value
        })
    };

    const handleShowPassword = (evt) => {
      setShowPassword(!showPassword)
    };

    const signMessage = (message, secretKey) => {
        const signedPassword = AES.encrypt(message, secretKey);
        return signedPassword;
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        let vault_key = await db.vault_key.where("username").equalsIgnoreCase(localStorage.getItem("email")).first();
        const signedPassword = signMessage(modalData.password, vault_key['key']).toString();
        const apiData = {
            ...modalData,
            password: signedPassword
        };
        const result = await axios.put('/api/v1/vault/edit_vault/', apiData, {params: {id: props.itemId}});
        if (result.status === 200) {
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
                Edit Domain and Credentials
            </Typography>
            <div className={classes.wrapper}>
                <TextField
                    className={classes.textField}
                    placeholder={'Domain'} name={'domain'}
                    onChange={handleChange}
                    value={modalData.domain}>
                </TextField>
            </div>
            <div className={classes.wrapper}>
                <TextField
                    className={classes.textField}
                    placeholder={'Username/Email'}
                    name={'username'}
                    onChange={handleChange}
                    value={modalData.username}>
                </TextField>
            </div>
            <div className={classes.wrapper}>
                <TextField
                    className={classes.textField}
                    placeholder={'Password'} name={'password'}
                    onChange={handleChange}
                    value={modalData.password}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{endAdornment:
                            <InputAdornment position={'end'}>
                                <IconButton onClick={handleShowPassword} classes={{focusVisible: classes.focus}} className={"removeFocus"}>
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>}}>
                </TextField>
            </div>
            <div className={`${classes.wrapper} ${classes.textField}`} onClick={handleSubmit}>
                <Button variant={'contained'} color={'primary'}>
                    Save
                </Button>
            </div>
        </div>
    );

    return (
        <div>
            <Modal open={props.modalState} onClose={handleClose} className={classes.modal}>
                {modalBody}
            </Modal>
        </div>
    )
}

export default EditModal;
