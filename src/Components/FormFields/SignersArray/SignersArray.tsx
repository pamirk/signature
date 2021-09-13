import React, { useCallback, useMemo } from 'react';
import { FieldArrayRenderProps } from 'react-final-form-arrays';
import classNames from 'classnames';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactSVG } from 'react-svg';
import _ from 'lodash';
import { Signer } from 'Interfaces/Document';
import { moveArrayItem } from 'Utils/functions';

import { UIAddButton } from 'Components/UIComponents/UIAddButton';

import CircleClose from 'Assets/images/icons/circle-close.svg';
import DraggableIcon from 'Assets/images/icons/draggable-icon.svg';
import useIsMobile from 'Hooks/Common/useIsMobile';

interface IsDepetablePredicateArgument {
  itemIndex: number;
  fields: FieldArrayRenderProps<Partial<Signer>, HTMLElement>['fields'];
}

interface SignersArrayProps extends FieldArrayRenderProps<Partial<Signer>, HTMLElement> {
  renderFields?: (name: any, index: any) => any;
  addLabel?: string;
  isItemDeletablePredicate?: (arg: IsDepetablePredicateArgument) => boolean;
  isOrdered?: boolean;
  skipFirst?: boolean;
  skipPreparer?: boolean;
  isAdditionDisabled?: boolean;
  withRoles?: boolean;
}

function SignersArray({
  fields,
  withRoles,
  isAdditionDisabled,
  isOrdered = false,
  renderFields,
  addLabel = 'Add signer',
  skipFirst = false,
  skipPreparer = true,
  isItemDeletablePredicate,
}: SignersArrayProps) {
  const isMobile = useIsMobile();
  const lastSigner = useMemo(() => _.maxBy(fields.value, 'order') as Partial<Signer>, [
    fields.value,
  ]);

  const handleSignerAdd = useCallback(
    () => fields.push({ order: (lastSigner.order || 0) + 1 }),
    [fields, lastSigner],
  );

  const handleDragEnd = useCallback(
    ({ source, destination }) => {
      if (destination) {
        moveArrayItem(fields.value, source.index, destination.index).map(
          (value, index) => {
            fields.update(index, { ...value, order: fields.value[index].order });
          },
        );
      }
    },
    [fields],
  );

  return (
    <div>
      <div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="signers">
            {(droppableProvided:any) => (
              <ul
                ref={droppableProvided.innerRef}
                className="signers__list"
                {...droppableProvided.droppableProps}
              >
                {fields.map((name, index) => {
                  const signer = fields.value[index];

                  if (signer.isPreparer && skipPreparer) return null;
                  if (signer.order === 1 && skipFirst) return null;

                  return (
                    <Draggable
                      draggableId={`signer_${name}`}
                      index={index}
                      key={name}
                      isDragDisabled={!isOrdered || !fields.length || fields.length <= 1}
                    >
                      {(draggableProvided:any, snapshot:any) => (
                        <li
                          className="signers__item"
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                        >
                          {isOrdered && (
                            <div className="signers__item-order">
                              {fields.length && fields.length > 1 && (
                                <ReactSVG
                                  src={DraggableIcon}
                                  className={classNames('signers__item-order-icon', {
                                    'signers__item-order-icon--dragged':
                                      snapshot.isDragging,
                                  })}
                                />
                              )}
                              <span className="signers__item-order-position">
                                {signer.order}.
                              </span>
                            </div>
                          )}
                          <div
                            className={classNames(
                              'signers__item-inner signers__item--removable',
                              { mobile: isMobile },
                            )}
                          >
                            {withRoles && (
                              <div className="signers__item-role">{signer.role}</div>
                            )}
                            <div className="signers__item-fields">
                              {renderFields && renderFields(name, index)}
                            </div>
                          </div>
                          {(!isItemDeletablePredicate ||
                            isItemDeletablePredicate({ itemIndex: index, fields })) && (
                            <ReactSVG
                              src={CircleClose}
                              draggable={false}
                              className="signers__remove"
                              onClick={() => {
                                fields.remove(index);
                              }}
                            />
                          )}
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {droppableProvided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      {!isAdditionDisabled && (
        <UIAddButton
          label={addLabel}
          onClick={handleSignerAdd}
          wrapperClassName="emailRecipients__add-wrapper"
          labelClassName="emailRecipients__add-label"
          iconClassName="emailRecipients__add-icon"
        />
      )}
    </div>
  );
}

export default SignersArray;
