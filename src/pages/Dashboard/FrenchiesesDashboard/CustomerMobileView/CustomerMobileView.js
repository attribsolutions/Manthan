
import { useParams } from 'react-router-dom';
import { CustomermobileViewBackground } from './CustomermobileViewBackground';
const CustomerMobileView = () => {
    const { Mac_ID } = useParams();
    
    return (
        <div>
            <CustomermobileViewBackground Details={Mac_ID} />
        </div>

    );


}

export default CustomerMobileView