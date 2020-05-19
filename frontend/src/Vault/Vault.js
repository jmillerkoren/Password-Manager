import React, {useState, useEffect} from 'react';
import Grid from "@material-ui/core/Grid";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import GridList from "@material-ui/core/GridList";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {DropdownButton, Dropdown} from "react-bootstrap";
import GridListTile from "@material-ui/core/GridListTile";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add"
import axios from "axios";
import VaultModal from "../VaulModal/VaultModal";
import db from "../VaultDb"
import AES from "crypto-js/aes"
import * as CryptoJS from 'crypto-js'
import lock from "../icons8-lock.svg"
import VaultItem from "../VaultItem/VaultItem";

const styles = makeStyles(theme => ({
    gridPadding: {
        paddingTop: '30px'
    },
    vaultGrid: {
        display: 'flex'
    },
    itemLogo: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#414E9F',
        paddingTop: '50px',
        paddingBottom: '50px'

    }
}));

const decryptMessage = (message, secretKey) => {
    const decryptedMessage = AES.decrypt(message, secretKey);
    return decryptedMessage;
};

function Vault() {
    const [vaultData, setData] = useState([]);
    const [vaultState, setState] = useState({
        updated: false
    });
    useEffect(() => {
        async function FetchVaultItems() {
            let unencryptedData = [];
            const result = await axios.get('/api/v1/vault/retrieve_vault/');
            if(result.data.length >= 1) {
                let vault_key = await db.vault_key.where("username").equalsIgnoreCase(localStorage.getItem("email")).first();
                unencryptedData = result.data.map(x => {
                    return {
                        ...x,
                        password: decryptMessage(x.password, vault_key['key']).toString(CryptoJS.enc.Utf8)
                    }
                });
            }
            setData(unencryptedData);
            setState({
                ...vaultState,
                updated: false
            });
        }
        FetchVaultItems();
    }, [vaultState.updated]);

    const classes = styles();

    const vault_items = vaultData.map((item) => {
        return (
            <VaultItem domain={item.domain} username={item.username} key={item.id}/>
        )
    });

    return (
        <div>
            <div className={classes.vaultGrid}>
                <VaultModal vaultState={vaultState} setState={setState}/>
                <Grid container justify={'flex-end'} spacing={2} direction={'row'} item>
                    <Grid item>
                        <DropdownButton id="dropdown-basic-button" title="Sort By:" variant="secondary" size="sm">
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </DropdownButton>
                    </Grid>
                </Grid>
            </div>
            <GridList className={classes.gridPadding} cellHeight={250} cols={4} spacing={15}>
                {vault_items}
            </GridList>
        </div>
    )
}

export default Vault;
