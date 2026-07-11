import Disclaimer from "../components/Disclaimer";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();
  return (
    <div>
    
      <Disclaimer/>
      
    </div>
  );
}
export default Home;
