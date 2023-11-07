import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../../../assets/searchBox/searchBox.scss';
import { MySearch } from './MySearch';

export const MainSearchBox = () => {
  const [searchRoleData, setSearchRoleData] = useState([]);
  const { RoleAccessData, searchProps } = useSelector((state) => ({
    RoleAccessData: state.Login.roleAccessSidbarData,
    searchProps: state.BreadcrumbReducer.searchProps,
  }));

  useEffect(() => {
    const flattenModuleData = RoleAccessData.flatMap((i) => i.ModuleData);
    setSearchRoleData(flattenModuleData);
  }, [RoleAccessData]);

  useEffect(() => {
    function autocomplete(inp, arr) {
      let currentFocus;

      inp.addEventListener('input', function (e) {
        const val = this.value.trim().toLowerCase();
        closeAllLists();

        if (val === '/') {
          return;
        }

        if (val.startsWith('/')) {
          const trimmedVal = val.substring(1);
          currentFocus = -1;
          const filteredItems = arr.filter((item) =>
            item.Name.toLowerCase().includes(trimmedVal)
          );

          if (filteredItems.length > 0) {
            const list = document.createElement('div');
            list.setAttribute('id', `${this.id}autocomplete-list`);
            list.setAttribute('class', 'autocomplete-items');
            this.parentNode.appendChild(list);

            filteredItems.forEach((item, index) => {
              const itemDiv = document.createElement('div');
              itemDiv.innerHTML = `<strong>${item.Name}</strong>`;
              itemDiv.innerHTML += `<input type='hidden' id='${index}' value='${item.Name}'>`;

              itemDiv.addEventListener('click', function (e) {
                inp.value = this.getElementsByTagName('input')[0].value;
                const inputId = this.getElementsByTagName('input')[0].id;
                const actualPagePath = filteredItems[inputId].ActualPagePath;
                window.location.href = actualPagePath;
                closeAllLists();
              });

              list.appendChild(itemDiv);
            });
          }
        }
      });

      inp.addEventListener('keydown', function (e) {
        const list = document.getElementById(`${this.id}autocomplete-list`);

        if (list) {
          const items = list.getElementsByTagName('div');

          if (e.keyCode === 40) {
            currentFocus++;
            addActive(items);
          } else if (e.keyCode === 38) {
            currentFocus--;
            addActive(items);
          } else if (e.keyCode === 13) {
            e.preventDefault();
            if (currentFocus > -1) {
              if (items) items[currentFocus].click();
            }
          }
        }
      });

      function addActive(items) {
        if (!items) return false;
        removeActive(items);

        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = items.length - 1;

        items[currentFocus].classList.add('autocomplete-active');
      }

      function removeActive(items) {
        for (let i = 0; i < items.length; i++) {
          items[i].classList.remove('autocomplete-active');
        }
      }

      function closeAllLists() {
        const lists = document.getElementsByClassName('autocomplete-items');

        for (let i = 0; i < lists.length; i++) {
          lists[i].parentNode.removeChild(lists[i]);
        }
      }

      document.addEventListener('click', function (e) {
        closeAllLists(e.target);
      });
    }

    autocomplete(document.getElementById('myInput'), searchRoleData);
  }, [searchRoleData]);

  return (
    <React.Fragment>
      <div className="app-search d-none d-lg-block " style={{ marginTop: "-3px" }} autocomplete="off">
        <div className="position-relative">
          <MySearch />
        </div>
      </div>

    </React.Fragment>
  );
};
