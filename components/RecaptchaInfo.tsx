import {Grid, Link} from "@mui/material";
import Box from "@mui/material/Box";
import {Security} from "@mui/icons-material";

export default function RecaptchaInfo() {
    return(
        <Grid item xs={12}>
            <Box fontSize="0.5rem">
                <Security sx={{ fontSize: 10 }}/> reCAPTCHA <Link href="https://policies.google.cn/">隐私权和条款</Link>
            </Box>
        </Grid>
    );
}