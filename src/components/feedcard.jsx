import './feedcard.css'
import sampleprofile from '../assets/sampleprofile.png'
import samplepost from '../assets/samplepost.webp'
import pin from '../assets/pin.png'
import { AnimatePresence, easeInOut, easeOut, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { HeartIcon, ChatIcon, PushPinIcon, PaperPlaneTiltIcon, ImageSquareIcon } from '@phosphor-icons/react'
import { Drawer } from 'vaul'
import { toast } from 'sonner'
import api from "../api"
import DOMPurify from "dompurify";
import InfiniteScroll from 'react-infinite-scroll-component'
import { useRef } from 'react'
import { createPortal } from 'react-dom'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { FeedCardSkeleton } from './feedcardskeleton'
import { CommentSkeleton } from './feedcardskeleton'

function Feedcard() {
    const [pinned, setPinned] = useState([])
    const [commentpanel, setCommentPanel] = useState(null)
    const [comment, setComment] = useState("")
    const [backnote, setbacknote] = useState([])
    const [comments, setComments] = useState({})
    const [commentUse, setcommentUser] = useState(false)
    const [commentcount, setCommentCount] = useState({})
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const loadingRef = useRef(false);
    const [commentPage, setCommentPage] = useState({});
    const [commentHasMore, setCommentHasMore] = useState({});
    const [commentLoading, setCommentLoading] = useState(false);
    const commentLoadingRef = useRef(false);
    const [feedError, setFeedError] = useState(false)
    const [commentsLoaded, setCommentLoaded] = useState({})
    const [commentsError, setCommentError] = useState({})
    const [imageLoaded, setImageLoaded] = useState({})
    const [imageFailed, setImageFailed] = useState({})
    const [replies,setReplies] = useState(false)
   

    // POST method
    // comment on a specific post
    async function sendcomments(noteId) {
        try {
            const res = await api.post(`/api/interact/comment/${noteId}`, {
                "comment": comment
            })
            const data = res.data
            console.log("status :", data.status);
            console.log("message :", data.message);

            setComment("")
            toast.success(data.message)
            await getcomments(noteId)
        } catch (error) {
            const message = error.response?.data?.message || "failed to comment try again"
            toast.error(message)
            console.error(message);
        }
    }

    // GET methods
    // get notes
    async function recieve_notes(pageNumber = 1) {
        if (loading) return;
        loadingRef.current = true;
        setLoading(true)

        if (pageNumber === 1) {
            setFeedError(false)
        }
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const res = await api.get(`/feed/public?page=${pageNumber}&limit=10`)
            const data = res.data

            console.log("Received notes:", data.notes.length);
            console.log("Current page:", data.page);
            console.log("Has next page:", data.has_next);

            setbacknote(prev => pageNumber === 1 ? data.notes : [...prev, ...data.notes])

            setPage(data.page)
            setHasMore(data.has_next)

            data.notes.forEach((note) => {
                getCommentCount(note.id);
            });

        } catch (error) {
            const message = error.response?.data?.message || "Failed to load feed"
            setFeedError(true)
            toast.error(message)
            console.error(message);
        } finally {
            loadingRef.current = false;
            setLoading(false)
        }
    }

    // get comments of a specific note
    async function getcomments(noteId, pageNumber = 1) {
        if (commentLoadingRef.current) return;
        commentLoadingRef.current = true;
        setCommentLoading(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const res = await api.get(`/api/interact/comment/${noteId}?page=${pageNumber}&limit=10`)
            const data = res.data
            console.log("COMMENTS:", data)
            console.log("COMMENTS RESPONSE:", data)
            console.log("COMMENTS ARRAY:", data.comments)
            console.log("TYPE:", Array.isArray(data.comments))
            setComments(prev => ({
                ...prev,
                [noteId]: pageNumber === 1
                    ? data.comments
                    : [...(prev[noteId] || []), ...data.comments]
            }));

            setCommentLoaded(prev => ({
                ...prev,
                [noteId]: true
            }));

            setCommentPage(prev => ({
                ...prev,
                [noteId]: data.page
            }));

            setCommentHasMore(prev => ({
                ...prev,
                [noteId]: data.has_next
            }));

            setCommentError(prev => ({
                ...prev,
                [noteId]: null
            }));
        } catch (error) {
            setCommentError(prev => ({
                ...prev,
                [noteId]: "Unable to load comments."
            }));
            const message = error.response?.data?.message || "Unable to Load Comments"
            toast.error(message)
            console.error(message)
        } finally {
            commentLoadingRef.current = false
            setCommentLoading(false)
        }
    }

   

    useEffect(() => {
        async function recievepins() {
            try {
                const res = await api.get('/api/interact/notepins/pin',)
                const data = res.data
                console.log(data);
                setPinned(data.pinned)
            } catch (error) {
                const message = error.response?.data?.message || "pins can't be recieved"
                toast.error(message)
                console.error(message)
            }
        }
        recieve_notes(1)
        recievepins()
    }, [])

    async function getCommentCount(noteId) {
        try {
            const res = await api.get(
                `/api/interact/commentcount/${noteId}`
            );

            setCommentCount(prev => ({
                ...prev,
                [noteId]: res.data.count
            }));

        } catch (error) {
            console.error("Failed to fetch comment count", error);
        }
    }


    // liking and unliking methods or routes
    // like and unlike a specific note
    const togglelike = async (noteId, isLiked) => {
        try {
            const end_point = isLiked ? `http://127.0.0.1:8000/api/interactremove/${noteId}` : `http://127.0.0.1:8000/api/interact/${noteId}`
            const res = await api.post(end_point)
            const data = res.data
            setbacknote(prev =>
                prev.map(note =>
                    note.id === noteId
                        ? {
                            ...note,
                            is_liked: !isLiked,
                            likes: isLiked
                                ? note.likes - 1
                                : note.likes + 1
                        }
                        : note
                )
            );
        } catch (error) {
            console.error("Failed to like", error);
        }
    }

    // like and unlike a specific comment of a specific note
    const togglecommentlike = async function (note_Id, comment_Id, is_liked) {
        const endpoint = is_liked ? `http://127.0.0.1:8000/api/interact/commentunlike/${note_Id}/${comment_Id}` : `http://127.0.0.1:8000/api/interact/commentlike/${note_Id}/${comment_Id}`
        try {
            const res = await api.post(endpoint)

            const data = await res.data
            console.log("DATA:", data)
            console.log("MESSAGE:", data.message)
            setComments(prev => ({
                ...prev, [note_Id]: prev[note_Id].map(comment =>
                    comment.id == comment_Id ? {
                        ...comment, is_liked: !is_liked,
                        likes: is_liked ? comment.likes - 1 : comment.likes + 1
                    }
                        : comment
                )
            }))
        } catch (error) {
            toast.error(error.message)
        }
    }

    //pin routes
    //pin and unpin a specific post to user profile
    const togglepin = async function (note_id) {
        const isPinned = pinned.includes(note_id)
        const endpoint = isPinned ? `http://127.0.0.1:8000/api/interact/notepins/unpinnote/${note_id}` : `http://127.0.0.1:8000/api/interact/notepins/pinnote/${note_id}`

        try {
            const res = await api.post(endpoint)

            const data = await res.data

            console.log("data:", data);
            console.log("message:", data.message);


            setPinned(prev =>
                isPinned
                    ? prev.filter(id => id !== note_id)
                    : [...prev, note_id]
            )
        } catch (error) {
            toast.error(error.message)
        }

    }

    //open comments function
    async function openComments(noteId) {
        console.log("Clicked note:", noteId);
        if (commentpanel === noteId) {
            setCommentPanel(null);
            return;
        }

        setCommentPanel(noteId);
        await getcomments(noteId, 1);
    }

    async function sendcomment() {
        sendcomments(commentpanel)
    }

    useEffect(() => {
    const checkWidth = () => {
        const feed = document.querySelector('.Feed');
        const card = document.querySelector('.Feedcardext');
        const content = document.querySelector('.postinside');

        console.table({
            feed: feed?.getBoundingClientRect().width,
            card: card?.getBoundingClientRect().width,
            content: content?.getBoundingClientRect().width
        });

        console.table(
    [...document.querySelectorAll('.Feedcardext')].map(card => ({
        id: card.dataset.noteId,
        width: card.getBoundingClientRect().width,
        scrollWidth: card.scrollWidth,
        clientWidth: card.clientWidth
    }))
);
    };

    checkWidth();
}, [backnote]);
    return (
        <>

            {
                backnote.length === 0 && loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <FeedCardSkeleton key={index} />
                    )
                    )) : backnote.length === 0 ? (
                        <div className='feed-empty'>
                            {feedError ? "Unable to load feed" : "No posts avaible yet"
                            }
                            {
                                feedError && (
                                    <button onClick={() => recieve_notes(1)}>Try Again</button>
                                )
                            }
                        </div>
                    ) : (
                    <InfiniteScroll
                        dataLength={backnote.length}
                        next={() => recieve_notes(page + 1)}
                        hasMore={hasMore}
                        
                        loader={
                            <div className="feed-pagination-loader">
                                <FeedCardSkeleton />
                            </div>
                        }
                    >
                        <>
                        {backnote.map((note) => (
                            <div className="Feedcardext" key={note.id}  data-note-id={note.id}>
                                <div className='profileimg'><img src={`http://127.0.0.1:8000${note.profilepicture}`} alt="profile" id='profilepic' /></div>
                                <motion.img src={pin} alt="toppin" className='toppin' initial={{ x: -10, y: 30, opacity: 0 }} animate={pinned.includes(note.id) ? { x: -2, y: -1, opacity: 1 } : { x: 0, y: 0, opacity: 0 }} />
                                <motion.div className="postinside" whileHover={{ y: -5, scale: 1 }} transition={{ ease: "easeOut" }}>
                                    <div className='headings'>
                                        <h3>{note.ghost_name}</h3>
                                    </div>
                                    <div className="postcontent" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.note || "") }}>
                                    </div>
                                    <div>
                                        {note.Post && (
                                            <img src={note.post} alt="post" id='postimage' />
                                        )}
                                    </div>
                                    <div className="likesdiv">
                                        <div className='actionicons'>
                                            <motion.div className='likes' onClick={() => togglelike(note.id, note.is_liked)} whileTap={{ y: 3, scale: 0.5 }}>
                                                <HeartIcon size={30} color={note.is_liked ? "#2bc1fb" : "#555"} weight={note.is_liked ? "fill" : "regular"} ></HeartIcon>
                                                <p>{note.likes ?? 0}</p>
                                            </motion.div>
                                            <motion.div className='comment' onClick={() => openComments(note.id)}>
                                                <ChatIcon size={30} ></ChatIcon>
                                                <p>{commentcount?.[note.id] ?? 0}</p>
                                            </motion.div>
                                            <motion.div className='pin' onClick={() => togglepin(note.id)} >
                                                <PushPinIcon size={30} color={pinned.includes(note.id) ? "red" : "#555"} weight={pinned.includes(note.id) ? "fill" : "regular"}  ></PushPinIcon>
                                            </motion.div>
                                        </div>
                                    </div>

                                </motion.div>
                            </div>
                       ))} </>
                    </InfiniteScroll>

                )
            }


            {commentpanel && (
                <div className='commentsouter'>
                    <div className="dialog">
                        <h2>Reflects</h2>
                    </div>
                    <motion.div className='commentspanel' initial={{ x: -3, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -5, opacity: 0, transition: { duration: 1, ease: easeOut } }} transition={{ duration: 1, ease: easeInOut }} whileHover={{ y: -5, scale: 1 }}>
                        {commentLoading && !commentsLoaded[commentpanel] && commentLoading ? ((
                            Array.from({ length: 4 }).map((_, index) => (
                                <CommentSkeleton key={index}></CommentSkeleton>
                            )
                            ))) : commentsError[commentpanel] ? (
                                <div className="commentdiv">
                                    <p>{commentsError[commentpanel]}</p>
                                    <button onClick={() => { getcomments(commentpanel, 1) }}></button>
                                </div>
                            ) : (

                            <InfiniteScroll
                                dataLength={(comments?.[commentpanel] || []).length}
                                next={() => {
                                    if (
                                        !commentLoading &&
                                        commentHasMore[commentpanel]
                                    ) {
                                        getcomments(
                                            commentpanel,
                                            (commentPage[commentpanel] || 1) + 1
                                        );
                                    }
                                }}
                                hasMore={commentHasMore[commentpanel] ?? false}
                                loader={
                                    <div className="feed-pagination-loader">
                                        <CommentSkeleton/>
                                    </div>
                                }>
                                {(comments?.[commentpanel] ?? []).length === 0 ? (
                                    <motion.div className='commentdiv'>
                                        <p>No Comments yet</p>
                                    </motion.div>
                                ) : (
                                    (comments[commentpanel] || []).map((comment) => (
                                        <motion.div className='commentdiv' key={comment.id} whileHover={{ y: -2 }}>
                                            <div className='commentbox'>
                                                <div id='commentuser'>
                                                    <h3>{comment.username}</h3>
                                                </div>
                                                <p>{comment.comment}</p>
                                            </div>
                                            <motion.div className='commentlike'>
                                                <HeartIcon size={30} color={comment.is_liked ? "#2bc1fb" : "#555"} weight={comment.is_liked ? "fill" : "regular"} onClick={() => togglecommentlike(commentpanel, comment.id, comment.is_liked)} whileTap={{ y: 3, scale: 1 }} ></HeartIcon>
                                                <p>{comment.likes}</p>
                                                <ChatIcon size={30} onClick={()=>setReplies(e=>!e)} ></ChatIcon>
                                                <p>0</p>
                                            </motion.div>
                                            {
                                                replies &&(
                                                    <div className='repliesbox'>
                                                        <h4>Disscussions</h4>
                                                        <div className='disscussionbox'>
                                                            <div className='disscussusername'>
                                                                <p>Username</p>
                                                            </div>
                                                            <div className='disscusscontent'>
                                                                <p>this is reply to use comment</p>
                                                            </div>
                                                            <div className='disscusslikes'>
                                                                <HeartIcon size={25}></HeartIcon>
                                                                <p>0</p>
                                                                <ChatIcon size={25}></ChatIcon>
                                                                <p>0</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </motion.div>
                                    )))}

                            </InfiniteScroll>


                        )
                        }
                    </motion.div>
                    <motion.div initial={{ x: -3, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -5, opacity: 0, transition: { ease: easeOut } }} transition={{ duration: 1, ease: easeInOut }} id='commentinput'>
                        <input type="text" placeholder='Reflect' value={comment} onChange={(e) => setComment(e.target.value)} />
                        <motion.div whileTap={{ x: 10, y: -10, opacity: 0 }} onClick={() => sendcomments(commentpanel)}><PaperPlaneTiltIcon size={25} id='sendcommenticon' ></PaperPlaneTiltIcon></motion.div>
                        <ImageSquareIcon size={25} id='sendcommenticon'></ImageSquareIcon>
                    </motion.div>

                </div>
            )}
        </>
    )
}
export default Feedcard