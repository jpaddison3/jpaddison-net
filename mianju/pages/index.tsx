import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Layout from "components/Layout"
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  profileImage: {
    borderRadius: "50%"
  }
}))

export default function Home() {
  const classes = useStyles()

  return <Layout>
    <Grid container justify="space-between" alignItems="center" spacing={3}>
      <Grid item md={6}>
        <Typography variant='h2' component='h1' color='primary'>JP Addison</Typography>

        <Typography gutterBottom>is a developer and <a href="https://www.effectivealtruism.org/articles/introduction-to-effective-altruism/">effective altruist</a>.</Typography>

        <Typography gutterBottom>I am the lead developer for the <a href="https://forum.effectivealtruism.org/">Effective Altruism Forum</a>. I contribute code to <a href="https://www.lesswrong.com/">LessWrong</a>, who's codebase I forked to make the Forum.</Typography>

        <Typography gutterBottom>You can find me elsewhere at <a href="https://github.com/jpaddison3">github</a> or <a href="https://www.linkedin.com/in/jpaddison3/">linkedin</a>.</Typography>

        <Typography gutterBottom>You can get in touch with me socially via <a href="https://www.facebook.com/jpaddison1.6">facebook</a> or <a href="mailto:johnpaddison@gmail.com">email</a>, or professionally via my <a href="mailto:jp@centreforeffectivealtruism.org">work email</a>.</Typography>
      </Grid>
      <Grid item md={5}>
        <img src="/jp-profile.jpg" alt="profile image" className={classes.profileImage}/>
      </Grid>
    </Grid>
  </Layout>
}
