import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function getUserById(ownerId) {
  return usersFromServer.find(user => user.id === ownerId);
}

const categories = categoriesFromServer.map((category) => {
  const newCategories = {
    ...category,
    user: getUserById(category.ownerId),
  };

  return newCategories;
});

function getCategoryById(categoryId) {
  return categories.find(category => category.id === categoryId);
}

const products = productsFromServer.map((product) => {
  const newProducts = {
    ...product,
    categoria: getCategoryById(product.categoryId),
  };

  return newProducts;
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const visibleProducts = products
    .filter(product => product.categoria.user.name.includes(selectedUser))
    .filter(product => product.name
      .toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                onClick={() => {
                  setSelectedUser('');
                }}
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({
                  'is-active': selectedUser === '',
                })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user.name);
                  }}
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({
                    'is-active': selectedUser === user.name,
                  })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  onChange={event => (
                    setQuery(event.target.value)
                  )}
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => {
                      setQuery('');
                    }}
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map(categor => (
                <a
                  key={categor.id}
                  data-cy="Category"
                  className={cn('button mr-2 my-1', {
                    'is-info': selectedCategories.includes(categor.title),
                  })}
                  href="#/"
                  onClick={() => {
                    setSelectedCategories((prevArray) => {
                      if (prevArray.includes(categor.title)) {
                        const ind = prevArray.indexOf(categor.title);
                        const newArr = [...prevArray];

                        newArr[ind] = '';

                        return newArr;
                      }

                      return [...prevArray, categor.title];
                    });
                  }}
                >
                  {categor.title}
                </a>
              ))
              }
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setQuery('');
                  setSelectedUser('');
                  setSelectedCategories([]);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!visibleProducts.length
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            ) : (
              <table
                data-cy="ProductTable"
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product

                        <a href="#/">
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort-up" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {
                    visibleProducts.map(product => (
                      <tr data-cy="Product" key={product.id}>
                        <td
                          className="has-text-weight-bold"
                          data-cy="ProductId"
                        >
                          {`${product.id}`}
                        </td>

                        <td data-cy="ProductName">{`${product.name}`}</td>
                        <td data-cy="ProductCategory">{`${product.categoria.icon} - ${product.categoria.title}`}</td>

                        <td
                          data-cy="ProductUser"
                          className={cn({
                            'has-text-link': product.categoria.user.sex === 'm',
                            'has-text-danger': product.categoria.user.sex
                              === 'f',
                          })}
                        >
                          {`${product.categoria.user.name}`}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  );
};
