import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { deleteEducation as deleteEducationAction } from '../../actions/profile';

const Education = ({ education, deleteEducation }) => {
  const educations = education.map(edu => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className="hide-sm">{edu.degree}</td>
      <td>
        <Moment format="YY/MM/DD">{edu.from}</Moment>-
        {edu.to === null ? ' Now' : <Moment format="YY/MM/DD">{edu.to}</Moment>}
      </td>
      <td>
        <button
          className="btn btn-danger"
          type="button"
          onClick={() => deleteEducation(edu._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </>
  );
};

Education.propTypes = {
  education: PropTypes.array,
  deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation: deleteEducationAction })(
  Education
);
