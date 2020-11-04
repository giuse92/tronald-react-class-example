import React from 'react';

const TagList = ({storedTags, onTagClick, selectedTag}) => {
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