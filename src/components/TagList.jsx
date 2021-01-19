import React from 'react';
import MyContext from "./MyContext";

const TagList = () => {
    const { storedTags, onTagClick, selectedTag } = React.useContext(MyContext);

    return (
        <p>
            {storedTags.map((tag, index) =>
                <span key={`tag-${index}`}>
                    <a
                        name={tag}
                        onClick={onTagClick}
                        className={selectedTag === tag ? "App-link-selected" : "App-link"}
                    >
                        {tag}
                    </a>
                    {index === storedTags.length - 1 ? '' : ' | '}
                </span>
            )}
        </p>
    )
}

export default TagList;