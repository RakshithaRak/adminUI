import { useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";

import "./Modal.scss";

const Modal = ({ isModal, onCancel, member, onSave }) => {
  if (!isModal) return null;

  const [localMember, setLocalMember] = useState({ ...member });

  const onChange = ({ target }) => {
    const { name, value } = target;

    setLocalMember((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <main className="modal-container">
      <div className="app-modal">
        <form>
          <div className="text-end mb-2">
            <LiaTimesSolid onClick={onCancel} role="button" size="18" />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              className="form-control"
              id="name"
              value={localMember.name}
              onChange={onChange}
              name="name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={localMember.email}
              onChange={onChange}
              name="email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              name="role"
              id="role"
              className="form-select"
              onChange={onChange}
              value={localMember.role}
            >
              <option value="admin">admin</option>
              <option value="member">member</option>
            </select>
          </div>

          <div className="text-end">
            <button
              className="btn btn-primary btn-sm save"
              onClick={(e) => onSave(e, localMember)}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Modal;
