import React, { useState } from 'react';
import get from 'lodash/get';

import { TrashIcon } from '../../_recognito-client-core_/src/Icons';

const STYLES = {
  wrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '300px',
  },
  group: {
    textDecoration: 'none',
    color: 'inherit'
  },
  connection: {
    fontSize: '0.8em',
    lineHeight: '0.8em',
    marginLeft: '0.8em',
    marginBottom: '0.5em',
    paddingLeft: '0.4em',
    paddingBottom: '0.4em',
    borderLeft: '2px solid #999',
    borderBottom: '2px solid #999'
  }
}

export default function ReletationsMenu({ groups, connections, annotations, onDelete }) {
  const [selectedGroup, setSelectedGroup] = useState(-1);
  const gs = Object.values(groups || {});  

  return (
    <div style={STYLES.wrapper}>
      {
        gs.map((group, i) => {
          const groupStyle = { ...STYLES.group, color: group.color };
          return (
            <div>
              <a
                href="javascript:void(0);"
                style={groupStyle}
                onClick={() => setSelectedGroup(i)}
              >
                Group #{i+1}
              </a>
              {selectedGroup === i && (
                <div>
                  {group.connections.map((connectionId) => {
                    let label = '';
                    const connectionStyle = { ...STYLES.connection, color: group.color };
                    const connection = connections.find(c => c.annotation.id === connectionId);
                    if (connection) {
                      const linkedAnnotations = get(connection, 'annotation.target', []).map(({ id }) => {
                        return annotations.find(a => a.id === id);
                      });
                      if (linkedAnnotations.length > 0) {
                        label = linkedAnnotations.map((annotation) => {
                          const textSelector = get(annotation, 'target.selector', []).find((s) => s.type === 'TextQuoteSelector');
                          return textSelector.exact || '---';
                        }).join(' ⇢ ');
                      }
                    }
                    return (
                      <div style={connectionStyle}>
                        {label}&nbsp;&nbsp;
                        <a
                          href="javascript:void(0);"
                          style={{ color: 'inherit' }}
                          onClick={() => onDelete(connection.getRelation())}
                        >
                          <TrashIcon width={12}/>
                        </a>
                      </div>
                    );
                  })}
                </div> 
              )}
              
            </div>
          );
        })
      }
    </div>
  )
}

/*

*/