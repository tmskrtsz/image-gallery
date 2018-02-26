import React from 'react';
import loadingIcon from '../assets/loading.svg';

const Loader = () =>
	<div className="loader">
		<img src={loadingIcon} alt="Loading..." />
	</div>

export default Loader
