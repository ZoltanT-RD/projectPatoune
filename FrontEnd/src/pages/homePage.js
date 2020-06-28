///section js
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import 'materialize-css';
import { Row, Col } from 'react-materialize';

import TitleBar from '../components/TitleBar';
import SideBar from '../components/SideBar';
import PageContent from '../components/PageContent';

///section css
import mainCSS from '../index.scss';
import CSS from './homePage.scss';

///section objects + components

class homePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageTitle: this.props.pageTitle ? this.props.pageTitle : 'PP',
			testBox: '',
		};
	}

	componentDidMount() {
		document.title = this.state.pageTitle; ///todo this will have to append the current navigationelement (try Redux?)
	}

	render() {
		return (
			<div className="homePage page">
				<Row className="full-height">
					<div className="homePage__sidebar">
						<SideBar />
					</div>

					<div className="homePage__content full-height">
						<Row>
							<Col s={12}>
								<TitleBar title="Project Patoune" />
							</Col>
						</Row>
						<Row>
                            <Col s={1}></Col>
							<Col s={10}>
								<PageContent />
							</Col>
                            <Col s={1}></Col>
						</Row>
					</div>
				</Row>
			</div>
		);
	}
}

homePage.propTypes = {
	pageTitle: PropTypes.string, //.isRequired,
};

export default homePage;
