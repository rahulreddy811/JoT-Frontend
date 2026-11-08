import Skeleton from "react-loading-skeleton";

export function FeedCardSkeleton(){
    return(
        <div className="Feedcardext skeleton-card">
            <div className="profileimg">
                <Skeleton circle width={45} height={45}/>
            </div>

            <div className="postinside">
                <div className="headings">
                    <Skeleton width={300} height={20}/>
                </div>
                <div className="postcontent">
                    <Skeleton count={3}/>
                    <Skeleton width="65%"/>
                </div>
                <div className="skeleton-actions">
                    <Skeleton width={35} height={35}/>
                    <Skeleton width={35} height={35}/>
                    <Skeleton width={35} height={35}/>
                </div>
            </div>
        </div>
    )
}

export function CommentSkeleton() {
    return(
        <div className="commentdiv">
            <div className="commentbox">
                <Skeleton width={100} height={18}/>
                <Skeleton height={2}/>
            </div>

            <Skeleton width={35} height={25}/>
        </div>
    )
}
