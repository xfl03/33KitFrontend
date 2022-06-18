import {Grid, Link} from "@mui/material";
import Box from "@mui/material/Box";

export default function RecaptchaInfo() {
    return(
        <Grid item xs={10}>
            <Box fontSize="0.5rem">
                <div>本网站使用了 reCAPTCHA <Link href="https://policies.google.cn/">隐私权和条款</Link></div>
            </Box>
        </Grid>
    );
}