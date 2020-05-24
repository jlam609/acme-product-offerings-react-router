import "@babel/polyfill";
import React, { Component } from "react";
import { HashRouter, Link, Route, Switch } from "react-router-dom";
import ReactDOM from "react-dom";
import axios from "axios";

const app = document.getElementById("app");
const products = axios.get(
  "https://acme-users-api-rev.herokuapp.com/api/products"
);
const companies = axios.get(
  "https://acme-users-api-rev.herokuapp.com/api/companies"
);
const offerings = axios.get(
  "https://acme-users-api-rev.herokuapp.com/api/offerings"
);

class CompaniesList extends Component {
  render() {
    const { companies } = this.props;
    let htmlString = companies.map((company, idx) => {
      let productString = company.offering.map((product, idx) => {
        return <li key={idx}>{product}</li>;
      });
      return (
        <div key={idx} className = 'listElem'>
          <li>{company.name}</li>
          <ul>
            Offering:
            {productString}
          </ul>
        </div>
      );
    });
    return htmlString;
  }
}
class ProductsList extends Component {
  render() {
    const { products } = this.props;
    let htmlString = products.map((product, idx) => {
      let companyString = product.company.map((elem, idx) => {
        return <li key={idx}>{elem}</li>;
      });
      return (
        <div key={idx} className = 'listElem'>
          <li>{product.name}</li>
          <ul>
            ${product.suggestedPrice}.00 <br />
            {product.description} <br />
            Offering:
            {companyString}
          </ul>
        </div>
      );
    });
    return htmlString;
  }
}
class App extends Component {
  state = {
    products: [],
    companies: [],
    loading: true,
    view: window.location.hash.slice(1)
  };
  componentDidMount() {
    Promise.all([products, companies, offerings])
      .then(([products, companies, offerings]) => {
        const companyList = companies.data.map((company) => {
          const { id } = company;
          let offeringsList = offerings.data
            .filter((offering) => {
              return offering.companyId === id;
            })
            .map((offering) => {
              let product = products.data
                .filter((product) => {
                  return product.id === offering.productId;
                })
                .map((elem) => elem.name);
              offering = `${product} $${offering.price}`;
              return offering;
            });
          company.offering = offeringsList;
          return company;
        });
        const productList = products.data.map((product) => {
          const { id } = product;
          let offeringsList = offerings.data
            .filter((offering) => {
              return offering.productId === id;
            })
            .map((offering) => {
              let company = companies.data
                .filter((company) => {
                  return company.id === offering.companyId;
                })
                .map((elem) => elem.name);
              offering = company.join(" ");
              return offering;
            });
          product.company = offeringsList;
          return product;
        });
        this.setState({
          products: productList,
          companies: companyList,
          loading: false,
          view: window.location.hash.slice(1)
        });
      })
      .catch((e) => console.error("error", e));
  }
  render() {
    const { products, companies, loading, view } = this.state;
    if (loading === true) return <h1>Loading Please Wait!</h1>;
    else {
      return (
        <HashRouter>
        <div className='header'>
          <h1>Acme Offerings *React</h1>
            <nav className = {view === 'companies' ? 'selected': 'tab'} onClick={(e)=> {
                e.preventDefault()
                this.setState({
                   view:'companies'
                })
            }}>
              <Link to="/companies">
                Companies <br /> ({companies.length})
              </Link>
            </nav>
            <nav  className = {view === 'products' ? 'selected': 'tab'} onClick={(e)=> {
                e.preventDefault()
                this.setState({
                    view:'products'
                 })
            }}>
              <Link to="/products">
                Products <br /> ({products.length})
              </Link>
            </nav>
            </div>
            <div className='list'>
            <Switch>
              <Route path={"/companies"}>
                {" "}
                {<CompaniesList  companies={companies} />}
              </Route>
              <Route path={"/products"}>
                {" "}
                {<ProductsList products={products} />}
              </Route>
            </Switch>
        </div>
        </HashRouter>
      );
    }
  }
}
ReactDOM.render(<App />, app, () => console.log("rendered"));
