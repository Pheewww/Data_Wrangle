import proptype from 'prop-types';
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-1/2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-2xl">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: proptype.bool.isRequired,
    onClose: proptype.func.isRequired,
    title: proptype.string.isRequired,
    children: proptype.node.isRequired,
};

export default Modal;