import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import { Card, Icon, Row, Col } from 'react-materialize';

///section css
import componentCSS from './Navigation.scss';

class Navigation extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			pages: [
				{
					icon: 'book',
					text: 'Library',
					ref: '/index.html',
					class: 'valign-wrapper',
				},
				{
					icon: 'settings',
					text: 'Settings',
					ref: '/settings.html',
					class: 'valign-wrapper',
				},
				{
					icon: 'face',
					text: 'Admin',
					ref: '/admin.html',
					class: 'valign-wrapper',
				},
			],
		};

		switch (this.props.isActive) {
			case 'Library':
				this.state.pages[0].class += ' active';
				break;

			case 'Settings':
				this.state.pages[1].class += ' active';
				break;

			case 'Admin':
				this.state.pages[2].class += ' active';
				break;
		}
	}

	render() {
		return (
			<div className={'navigation'}>
				<Row>
					<Col s={12}>
						<ul className="mt0 mb0">
							{this.state.pages.map((navList) => (
								<li key={uuidv4()}>
									<a href={navList.ref} className={navList.class}>
										<span class="material-icons md-18">{navList.icon}</span>
										<span class="link-text">{navList.text}</span>
									</a>
								</li>
							))}
						</ul>
					</Col>
				</Row>
			</div>
		);
	}
}

Navigation.propTypes = {
	isActive: PropTypes.string.isRequired,
};

export default Navigation;
