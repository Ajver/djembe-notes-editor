import { navigateTo } from '../../helpers/navigation';

const Link = ({ to, children, ...props }) => {
    const handleClick = (e) => {
        e.preventDefault();
        
        const view = to.startsWith('/') ? to.slice(1) : to;
        navigateTo(view);
    };

    return (
        <a href={to} onClick={handleClick} {...props}>
            {children}
        </a>
    );
};

export default Link;