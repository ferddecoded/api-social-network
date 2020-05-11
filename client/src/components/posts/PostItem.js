import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { addLike as addLikeAction, removeLike as removeLikeAction, deletePost as deletePostAction } from '../../actions/post';

const PostItem = 
({
  addLike,
  removeLike,
  deletePost,
  auth,
  showActions = true,
  post: {
    _id,
    text,
    name,
    avatar,
    user,
    likes,
    comments,
    date,
  }  
}) => (
  <>
    <div class="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img
            class="round-img"
            src={avatar}
            alt=""
          />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p class="my-1">
          {text}
        </p>
        <p class="post-date">
            Posted on <Moment format="YY/MM/DD">{date}</Moment>
        </p>
        {showActions && (
          <>
            <button type="button" class="btn btn-light" onClick={() => addLike(_id)}>
              <i class="fas fa-thumbs-up"></i>
              {likes.length > 0 && <span> {likes.length}</span>}
            </button>
            <button type="button" class="btn btn-light" onClick={() => removeLike(_id)}>
              <i class="fas fa-thumbs-down"></i>
            </button>
            <Link to={`/posts/${_id}`} class="btn btn-primary">
              Discussion {comments.length > 0 && (
                <span class='comment-count'>{comments.length}</span>
              )}
            </Link>
            {!auth.loading && user === auth.user._id && (
              <button      
                type="button"
                class="btn btn-danger"
                onClick={() => deletePost(_id)}
              >
                <i class="fas fa-times"></i>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  </>
);

PostItem.propTypes = {
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
};

const mapState = state => ({
  auth: state.auth,
})

export default connect(mapState, {
  addLike: addLikeAction,
  removeLike: removeLikeAction,
  deletePost: deletePostAction,
})(PostItem);