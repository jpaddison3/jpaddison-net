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

        <Typography gutterBottom>I am the head of the Online Team at the <a href="https://www.centreforeffectivealtruism.org/">Centre for Effective Altruism</a>. I help run the <a href="https://forum.effectivealtruism.org/">Effective Altruism Forum</a>.

        <Typography gutterBottom>You can find me elsewhere at <a href="https://github.com/jpaddison3">github</a> or <a href="https://www.linkedin.com/in/jpaddison3/">linkedin</a>.</Typography>

        <Typography gutterBottom>You can get in touch with me socially via <a href="mailto:johnpaddison@gmail.com">email</a>, or professionally via my <a href="mailto:jp@centreforeffectivealtruism.org">work email</a>.</Typography>
      </Grid>
      <Grid item md={5}>
        <img src="https://res.cloudinary.com/jpaddison/image/upload/v1600099735/jp-profile.jpg" alt="profile image" className={classes.profileImage}/>
      </Grid>
    </Grid>
  </Layout>
}
