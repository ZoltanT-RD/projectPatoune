import React, { Fragment } from 'react';
import Moment from 'react-moment';

class MomentHelper {

    ///todo brackets should only render if both are requested. if only "showHowLongAgo" renders, brackets should be left out

    static formatUnixDate(dateInt, isDetailed = false, showDate = true, showHowLongAgo = true) {
        return (
            <Fragment>
                {showDate && 
                <span>
                    <Moment 
                        date={dateInt} 
                        unix={true} 
                        utc={true} 
                        format={isDetailed ? "YYYY-MM-DD HH:mm:ss::SSS" : "YYYY-MM-DD HH:mm"}
                        fromNow={showHowLongAgo}
                    />
                </span>
                }
                {showHowLongAgo && 
                    <span> (<Moment 
                        date={dateInt} 
                        unix={true} 
                        utc={true} 
                        //format={"YYYY-MM-DD HH:mm"}
                        fromNow={true}
                    />
                    )</span>
                }
            </Fragment>    
            );
    }
}

export default MomentHelper;