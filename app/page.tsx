import LoginPage from "./Loginpage"
import connectdb from "./lib/connectdb"

const  MainPage =async () => {
  try{
    await connectdb();
  }
  catch(err)
  {
    console.log(err);
  }
  return (
    <LoginPage/>
  )
}

export default MainPage
