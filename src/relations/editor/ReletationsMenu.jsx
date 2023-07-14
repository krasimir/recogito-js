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
    <div class="c-relations-menu">
      {
        gs.map((group, i) => {
          return (
            <div class={`c-relations-item c-relations-item-${i+1}`} style={{ color: group.color }}>
              <a
                href="javascript:void(0);"
                class="c-relations-group-link"
                onClick={() => setSelectedGroup(i)}
              >
                Group #{i+1}
              </a>
              {selectedGroup === i && (
                <div>
                  {group.connections.map((connectionId, j) => {
                    let label = '';
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
                      <div class={`c-relations-menu-con c-relations-menu-con-${j+1}`}>
                        {label}&nbsp;&nbsp;
                        <a
                          href="javascript:void(0);"
                          class="c-relations-menu-con-link"
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