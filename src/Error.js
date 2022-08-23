import PropTypes from 'prop-types';

function childrenOrText(props, propName, componentName) {
  return (props.hasOwnProperty('children') ^ props.hasOwnProperty('text')) === 0
    ? new Error('The `children` and `text` properties are mutually exclusive.') : null;
}

function Error({ children, text }) {
  return (
    <div className="text-center mt-3">
      {
        children || <p className="lead">{text}</p>
      }
    </div>
  );
}

Error.propTypes = {
  children: childrenOrText,
  text: childrenOrText,
};

export default Error;
