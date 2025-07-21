import '../styles/Start.css';
import NavBar from './NavBar';
import ListCard from './ListCard';
import addListIcon from '../images/add_list.svg';

const Start = ({ data }) => {
    return (
        <>
            <NavBar />
            <div className='list-container'>
                {data.lists.map(list => {
                    return <ListCard key={list.id} list={list} />;
                })}
            </div>
            <div className='add-list-button'>
                <img src={addListIcon} alt="Add List" />
            </div>
        </>
    );
};

export default Start;