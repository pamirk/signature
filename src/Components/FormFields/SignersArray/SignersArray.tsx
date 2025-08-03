import React, { useCallback, useMemo, useEffect } from 'react';
import { FieldArrayRenderProps } from 'react-final-form-arrays';
import classNames from 'classnames';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactSVG } from 'react-svg';
import { maxBy } from 'lodash';
import { InteractExtraValues, Signer } from 'Interfaces/Document';
import { moveArrayItem } from 'Utils/functions';

import { UIAddButton } from 'Components/UIComponents/UIAddButton';

import CircleClose from 'Assets/images/icons/circle-close.svg';
import DraggableIcon from 'Assets/images/icons/draggable-icon.svg';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { checkSignersLimit } from 'Utils/validation';
import Toast from 'Services/Toast';
import { useSelector } from 'react-redux';
import { selectUser, selectUserPlan } from 'Utils/selectors';
import { User } from 'Interfaces/User';
import { PlanTypes } from 'Interfaces/Billing';

interface IsDepetablePredicateArgument {
  itemIndex: number;
  fields: FieldArrayRenderProps<Partial<Signer>, HTMLElement>['fields'];
}

interface SignersArrayProps extends FieldArrayRenderProps<Partial<Signer>, HTMLElement> {
  renderFields?: (name: string, index: number) => any;
  addLabel?: string;
  isItemDeletablePredicate?: (arg: IsDepetablePredicateArgument) => boolean;
  isOrdered?: boolean;
  isOrderedDisabled?: boolean;
  skipFirst?: boolean;
  skipPreparer?: boolean;
  isAdditionDisabled?: boolean;
  isRemoveDisabled?: boolean;
  withRoles?: boolean;
  handleSetSignersValues?: (values: InteractExtraValues) => void;
}

function SignersArray({
  fields,
  withRoles,
  isAdditionDisabled,
  isRemoveDisabled,
  isOrdered = false,
  isOrderedDisabled = false,
  renderFields,
  addLabel = 'Add signer',
  skipPreparer = true,
  isItemDeletablePredicate,
  handleSetSignersValues,
}: SignersArrayProps) {
  const isMobile = useIsMobile();

  const isAloneSigner = useMemo(
    () => fields.value.filter(value => value.order && value.order > 0).length === 1,
    [fields.value],
  );
  const lastSigner = useMemo(() => maxBy(fields.value, 'order') as Partial<Signer>, [
    fields,
  ]);

  const userPlan = useSelector(selectUserPlan);
  const user: User = useSelector(selectUser);

  const handleSignerAdd = useCallback(() => {
    const checkLimit = checkSignersLimit(fields.value.length);
    if ((user.isTrialSubscription || userPlan.type === PlanTypes.FREE) && checkLimit) {
      return Toast.error(checkLimit);
    }
    fields.push({ order: Math.max((lastSigner.order || 0) + 1, 1) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, lastSigner]);

  const handleSignerRemove = useCallback(
    (index: number) => {
      for (let i = index + 1; i < fields.value.length; i++) {
        const { order } = fields.value[i - 1];
        fields.update(i, { ...fields.value[i], order });
      }

      fields.remove(index);
    },
    [fields],
  );

  const handleDragEnd = useCallback(
    ({ source, destination }) => {
      if (destination) {
        moveArrayItem(fields.value, source.index, destination.index).forEach(
          (value, index) => {
            fields.update(index, { ...value, order: fields.value[index].order });
          },
        );
      }
    },
    [fields],
  );

  useEffect(() => {
    if (handleSetSignersValues && fields.value)
      handleSetSignersValues({ signers: fields.value as Signer[], isOrdered: isOrdered });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.value]);

  return (
    <div>
      <div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="signers">
            {droppableProvided => (
              <ul
                className="signers__list"
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
              >
                {fields.map((name, index) => {
                  const signer = fields.value[index];

                  if (signer.isPreparer && skipPreparer) return null;

                  return (
                    <Draggable
                      draggableId={`signer_${name}`}
                      index={signer.order}
                      key={name}
                      isDragDisabled={
                        isOrderedDisabled ||
                        !isOrdered ||
                        isAloneSigner ||
                        !fields.length ||
                        fields.length <= 1
                      }
                    >
                      {(draggableProvided, snapshot) => (
                        <li
                          className="signers__item"
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                        >
                          {isOrdered && !isAloneSigner && !isOrderedDisabled && (
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
                            isItemDeletablePredicate({ itemIndex: index, fields })) &&
                            !isRemoveDisabled && (
                              <ReactSVG
                                src={CircleClose}
                                draggable={false}
                                className="signers__remove"
                                onClick={() => handleSignerRemove(index)}
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
