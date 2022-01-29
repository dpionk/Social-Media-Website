import axios from 'axios';
import { Field, Formik } from 'formik';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AiFillDelete, AiFillEdit, AiOutlineLike, AiOutlineDislike } from 'react-icons/ai'
import './Post.scss'

function Post({ user, mqtt, isAdmin }) {

	const history = useNavigate();
	const [hasReactions, setHasReactions] = useState();
	const [reactions, setReactions] = useState();
	const [comments, setComments] = useState();
	const [editingComment, setEditingComment] = useState([false, null]);
	const [editingPost, setEditingPost] = useState(false);
	const [post, setPost] = useState();
	const { id } = useParams();

	
	const downloadPost = () => {
		axios.get(`http://localhost:5000/posts/${id}`).then((response) => {
			setPost(response.data[0])
		}).catch(error => {
			console.log(error)
		}).finally(() => {
			//setLoading(false);
		})
	}

	const deletePost = (id) => {
		axios.delete(`http://localhost:5000/posts/${id}`).then(() => {
			alert('Usunięto')
			history(`/users/${user}`)
		}).catch(error => {
			console.log(error)
			alert('Coś poszło nie tak')
		}).finally(() => {
			//setLoading(false);
		})
	}

	const downloadComments = () => {
		axios.get(`http://localhost:5000/comments/${id}`).then((response) => {
			setComments(response.data)
		}).catch(error => {
			console.log(error)
		}).finally(() => {
			//setLoading(false);
		})
	}

	const downloadReactions = () => {
		axios.get(`http://localhost:5000/reactions/${id}`).then((response) => {
			setHasReactions(response.data.filter((reaction) => {
				return reaction.reaction_user_id === parseInt(user)
			}))
			setReactions(response.data.reduce((prev, curr) => {
				if (curr.reaction_type in prev) {
					prev[curr.reaction_type]++
				  }
				  else {
					prev[curr.reaction_type] = 1
				  }
				  return prev
			}, {}))
			console.log(hasReactions)
		}).catch(error => {
			console.log(error)
		}).finally(() => {
			//setLoading(false);
		})
	}

	const submitReaction = (value) => {
		
		const values = {
			author: user,
			type: value
		}
		if (hasReactions.length !== 0) {
			axios.put(`http://localhost:5000/reactions/${id}`, values).then(() => {
				mqtt.publish(`reactions/${id}`, JSON.stringify(values));
			}).catch(error => {
				console.log(error)
				alert('Coś poszło nie tak')
			}).finally(() => {
				//setLoading(false);
			})

		}

		else {
		axios.post(`http://localhost:5000/reactions/${id}`, values).then(() => {
			mqtt.publish(`reactions/${id}`, JSON.stringify(values));
		}).catch(error => {
			console.log(error)
			alert('Coś poszło nie tak')
		}).finally(() => {
			//setLoading(false);
		})
	}
	}


	const deleteComment = (id) => {
		axios.delete(`http://localhost:5000/comments/${id}`).then(() => {
			downloadComments();
			alert('Usunięto komentarz')
		}).catch(error => {
			console.log(error)
		}).finally(() => {
			//setLoading(false);
		})
	}

	const handleSubmit = (values) => {
		axios.post(`http://localhost:5000/comments/${id}`, values).then(() => {
			mqtt.publish(`comment/${id}`, JSON.stringify(values));
		}).catch(error => {
			console.log(error)
			alert('Coś poszło nie tak')
		}).finally(() => {
			//setLoading(false);
		})
	}

	const handleSubmitEdit = (values) => {

		axios.put(`http://localhost:5000/comments/${values.id}`, values).then(() => {
			downloadComments();
			setEditingComment([false, null])
			alert('Zmieniono komentarz')

		}).catch(error => {
			console.log(error)
			alert('Coś poszło nie tak')
		}).finally(() => {
			//setLoading(false);
		})
	}

	const handleSubmitEditPost = (values) => {
		axios.put(`http://localhost:5000/posts/${id}`, values).then(() => {
			downloadPost();
			setEditingPost(false)
			alert('Zmieniono posta')

		}).catch(error => {
			console.log(error)
			alert('Coś poszło nie tak')
		}).finally(() => {
			//setLoading(false);
		})
	}


	const handleValidate = (values) => {
		const errors = {};

		if (values.content === '') {
			errors.content = 'Proszę wpisać komentarz'
		}

		return errors
	}

	useEffect(() => {
		downloadPost();
		downloadComments();
		downloadReactions();
	}, [id]

	
	);

	useEffect(() => {
		
		
		mqtt.subscribe(`comment/${id}`);
		const handleMessage = (topic, comment) => {
			if (topic !== `comment/${id}`) return;
			//setComments((comments) => [...comments, JSON.parse(comment)]);
			downloadComments();
		};

		mqtt.addMessageHandler(handleMessage);

		return () => {
			mqtt.unsubscribe(`comment/${id}`);
			mqtt.removeMessageHandler(handleMessage);
		}

	}, [mqtt, id]);

	useEffect(() => {
		
		mqtt.subscribe(`reactions/${id}`);
		const handleMessage = (topic, reaction) => {
			if (topic !== `reactions/${id}`) return;
			downloadReactions();
		};

		mqtt.addMessageHandler(handleMessage);

		return () => {
			mqtt.unsubscribe(`reactions/${id}`);
			mqtt.removeMessageHandler(handleMessage);
		}

	}, [mqtt, id]);

	console.log(reactions)
	return (
		<div className='post-container'>
			{post && comments &&
				<div className='post-comments'>
					<div className='post' key={post.post_id}>
						<div className='edit-post'>
							<div className='title'>{!editingPost ? post.title : null}
								{parseInt(user) === post.creator ? <button className="btn" type="button" onClick={() => { setEditingPost(!editingPost) }}><AiFillEdit /></button> : null}
								{parseInt(user) === post.creator || isAdmin === true ? <button className="btn" type="button" onClick={() => { deletePost(post.post_id) }}><AiFillDelete /></button> : null}
							</div>
							<div>
							</div>
						</div>
						<div className='content'>{!editingPost ? post.post_content :
							<div className='form'>
								<Formik
									enableReinitialize
									//validate={handleValidate}
									onSubmit={handleSubmitEditPost}
									initialValues={
										{
											title: post.title,
											post_content: post.post_content

										}
									}
								>
									{
										(formProps) => (
											<form>
												<div className='form-group'>
													<label>Edytuj posta</label>
													<Field type='text' className='form-control' name='title' >

													</Field>
													<Field type='text' as='textarea' className='form-control' name='post_content' >
													</Field>
													{formProps.touched.post_contentt && formProps.errors.post_content ? <div>{formProps.errors.post_content}</div> : null}
												</div>
												<button type='button' className='btn btn-primary' onClick={formProps.handleSubmit}>Zatwierdź</button>
											</form>
										)
									}
								</Formik>
								
							</div>
						
						}
						
						
						</div>
						
							{ reactions && 
							<div className='reactions'> 
							{reactions.like ? reactions.like : 0}<button type='button' className={hasReactions.length !== 0 && hasReactions[0].reaction_type === 'like' ? 'btn like' : 'btn'} onClick={() => submitReaction('like')}><AiOutlineLike/></button>
							{reactions.dislike ? reactions.dislike : 0}<button type='button' className={hasReactions.length !== 0 && hasReactions[0].reaction_type === 'dislike' ? 'btn dislike' : 'btn'}  onClick={() => submitReaction('dislike')}><AiOutlineDislike/></button>
							</div>
						}
						
					</div>
					<div className='comments'>
						<div className='title'>Komentarze</div>
						{comments.map((comment) => {
							return <div className='comment' key={Math.random()}>
								<div className='img-author'>
									<div>
										<img src={comment.picture ? comment.picture : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt='user' />
										<Link to={`/users/${comment.user_id}`}>{comment.username} </Link>
									</div> {parseInt(user) === comment.person_id || isAdmin === true ? <div><button className="btn" type="button" onClick={() => { deleteComment(comment.comment_id) }}><AiFillDelete /></button><button className="btn" type="button" onClick={() => { ; if (!editingComment[0]) { setEditingComment([true, comment.comment_id]) } else { setEditingComment([false, null]); } }}><AiFillEdit /></button></div> : null}
								</div>
								<div> {editingComment[0] && editingComment[1] === comment.comment_id ?

									<div className='form'>
										<Formik
											enableReinitialize
											//validate={handleValidate}
											onSubmit={handleSubmitEdit}
											initialValues={
												{
													id: comment.comment_id,
													comment_content: comment.comment_content
												}
											}
										>
											{
												(formProps) => (
													<form>
														<div className='form-group'>
															<label>Edytuj komentarz</label>
															<Field type='text' as='textarea' className='form-control' name='comment_content' >
															</Field>
															{formProps.touched.content && formProps.errors.content ? <div>{formProps.errors.content}</div> : null}
														</div>
														<button type='button' className='btn btn-primary' onClick={formProps.handleSubmit}>Zatwierdź</button>
													</form>
												)
											}
										</Formik>
									</div>

									: comment.comment_content}
								</div>
							</div>
						})}
					</div>
				</div>
			}
			<div className='form'>
				<Formik
					enableReinitialize
					validate={handleValidate}
					onSubmit={handleSubmit}
					initialValues={
						{
							author: user,
							content: ''
						}
					}
				>
					{
						(formProps) => (
							<form>
								<div className='form-group'>
									<Field type='text' as='textarea' className='form-control' name='content' placeholder='dodaj komentarz...' >
									</Field>
									{formProps.touched.content && formProps.errors.content ? <div>{formProps.errors.content}</div> : null}
								</div>
								<button type='button' className='btn btn-primary' onClick={formProps.handleSubmit}>Zatwierdź</button>
							</form>
						)
					}
				</Formik>
			</div>
		</div>
	)
}

export default Post;