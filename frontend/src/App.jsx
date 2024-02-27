import { useEffect, useState } from "react";
import { FaEdit, FaRegSave } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

import "./App.css";

import Pagination from "./components/forms/pagination/Pagination";
import useMembers from "./hooks/useMembers";

const size = 10;

function App() {
  const [state, setState] = useState({
    currentPage: 1,
    isEdit: false,
    members: {
      currentMember: {},
      partial: [],
      searchedResult: [],
      total: [],
    },
    searchText: "",
  });

  useEffect(() => {
    useMembers().then((membersFromAPI) => {
      const partialMembers = pageCalculation(membersFromAPI, state.currentPage);
      const stateMembers = { ...state.members };

      stateMembers.total = membersFromAPI;
      stateMembers.partial = partialMembers;

      handleStateUpdate({ members: stateMembers });
    });
  }, []);

  const onSave = () => {
    const partialMembers = state.members.partial.map((currentMember) => {
      if (state.members.currentMember.id === currentMember.id)
        return state.members.currentMember;
      return currentMember;
    });

    const stateMembers = { ...state.members };

    stateMembers.partial = partialMembers;
    stateMembers.currentMember = {};

    handleStateUpdate({ members: stateMembers, isEdit: false });
  };

  const onDelete = (selectedMemberId) => {
    const totalMembers = state.members.total.filter(
      (currentMember) => currentMember.id !== selectedMemberId
    );

    const partialMembers = pageCalculation(totalMembers, state.currentPage);

    const stateMembers = { ...state.members };

    stateMembers.total = totalMembers;
    stateMembers.partial = partialMembers;

    handleStateUpdate({ members: stateMembers });
  };

  const onDeleteSelected = () => {
    const totalMembers = state.members.total.filter(
      (currentMember) => !currentMember.checked
    );

    const partialMembers = pageCalculation(totalMembers, state.currentPage);

    const stateMembers = { ...state.members };

    stateMembers.total = totalMembers;
    stateMembers.partial = partialMembers;

    handleStateUpdate({ currentPage: 1, members: stateMembers });
  };

  const onSearch = (event) => {
    event.preventDefault();

    const regex = new RegExp(state.searchText, "i");

    const resultMembers = state.members.total.filter(
      (currentMember) =>
        currentMember.name.match(regex) ||
        currentMember.email.match(regex) ||
        currentMember.role.match(regex)
    );

    const partialMembers = pageCalculation(resultMembers, state.currentPage);

    const stateMembers = { ...state.members };

    stateMembers.partial = partialMembers;
    stateMembers.searchedResult = resultMembers;

    handleStateUpdate({ members: stateMembers, currentPage: 1 });
  };

  const onPageChange = (currentPage) => {
    const members = state.members.searchedResult.length
      ? state.members.searchedResult
      : state.members.total;

    const partialMembers = pageCalculation(members, currentPage);

    const stateMembers = { ...state.members };

    stateMembers.partial = partialMembers;

    handleStateUpdate({ currentPage, members: stateMembers });
  };

  const pageCalculation = (data, currentPage) => {
    const start = (currentPage - 1) * size;
    const end = start + size;

    return data.slice(start, end);
  };

  const handleCheckBox = ({ target }, currentMember) => {
    const modifiedMembers = state.members.partial.map((member) => {
      if (currentMember) {
        if (currentMember.id === member.id) member.checked = target.checked;
      } else member.checked = target.checked;

      return member;
    });

    const stateMembers = { ...state.members };
    stateMembers.partial = modifiedMembers;

    handleStateUpdate({ members: stateMembers });
  };

  const onChange = ({ target }) => {
    const { name, value } = target;

    const stateMembers = { ...state.members };

    stateMembers.currentMember[name] = value;

    handleStateUpdate({ members: stateMembers });
  };

  const handleStateUpdate = (newState) =>
    setState((prevState) => ({ ...prevState, ...newState }));

  const isAllChecked = state.members.partial.every((member) => member.checked);
  const isLeastChecked = state.members.partial.some((member) => member.checked);

  return (
    <main className="container-fluid pt-5 h-100 position-relative">
      <div className="container h-100">
        <form>
          <div className="row mb-3 align-items-center">
            <div className="col">
              <input
                placeholder="Search by name, email or role"
                className="form-control"
                onChange={({ target }) =>
                  handleStateUpdate({ searchText: target.value })
                }
              />
            </div>
            <div className="col-auto">
              <button
                className="btn btn-primary btn-sm search-icon"
                onClick={onSearch}
              >
                Search
              </button>
            </div>
          </div>
        </form>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={handleCheckBox}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.members.partial.map((currentMember, index) => {
              const memberEditId =
                state.isEdit &&
                state.members.currentMember.id === currentMember.id;

              return (
                <tr
                  key={index}
                  className={currentMember.checked ? "table-secondary" : ""}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={currentMember.checked || false}
                      onChange={(event) => handleCheckBox(event, currentMember)}
                    />
                  </td>
                  <td>
                    {memberEditId ? (
                      <input
                        className="w-100"
                        name="name"
                        onChange={onChange}
                        value={state.members.currentMember.name}
                      />
                    ) : (
                      currentMember.name
                    )}
                  </td>
                  <td>
                    {memberEditId ? (
                      <input
                        className="w-100"
                        onChange={onChange}
                        name="email"
                        value={state.members.currentMember.email}
                      />
                    ) : (
                      currentMember.email
                    )}
                  </td>
                  <td>
                    {memberEditId ? (
                      <select
                        name="role"
                        onChange={onChange}
                        value={state.members.currentMember.role}
                      >
                        <option value="member">member</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      currentMember.role
                    )}
                  </td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center">
                      <button
                        className={`btn ${memberEditId ? "save" : "edit"}`}
                        onClick={() => {
                          if (memberEditId) return onSave();

                          handleStateUpdate({
                            isEdit: true,
                            members: { ...state.members, currentMember },
                          });
                        }}
                      >
                        {memberEditId ? <FaRegSave /> : <FaEdit />}
                      </button>

                      <button
                        className="btn delete"
                        onClick={() => onDelete(currentMember.id)}
                      >
                        <MdDeleteOutline className="text-danger" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <section className="row mb-5 pb-4">
          <div className="col-auto">
            <button
              className="btn btn-danger btn-sm"
              disabled={!isLeastChecked}
              onClick={onDeleteSelected}
            >
              Delete Selected
            </button>
          </div>
          <div className="col">
            <Pagination
              currentPage={state.currentPage}
              dataLength={
                state.members.searchedResult.length ||
                state.members.total.length
              }
              onPageChange={onPageChange}
              size={size}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
