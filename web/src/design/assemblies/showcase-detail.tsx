"use client";

import {
  Modal,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
  Tag,
} from "@carbon/react";
import type { ShowcaseItem } from "@/gen/erp/showcase/v1/showcase_pb";
import { formatDate, formatMoney } from "@/lib/format";
import styles from "../design.module.scss";
import { statusLabel, statusTag } from "../showcase-utils";

export function ShowcaseDetailModal({
  item,
  onClose,
}: {
  item: ShowcaseItem | null;
  onClose: () => void;
}) {
  return (
    <Modal
      open={Boolean(item)}
      modalHeading={item?.title ?? "Showcase item"}
      primaryButtonText="Close"
      onRequestClose={onClose}
      onRequestSubmit={onClose}
    >
      {item ? (
        <>
          <p className="cds--modal-content__text">{item.description}</p>
          <StructuredListWrapper aria-label="Showcase item detail">
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>Field</StructuredListCell>
                <StructuredListCell head>Value</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              <StructuredListRow>
                <StructuredListCell noWrap>Status</StructuredListCell>
                <StructuredListCell>
                  <Tag type={statusTag(item.status)}>
                    {statusLabel(item.status)}
                  </Tag>
                </StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell noWrap>Owner</StructuredListCell>
                <StructuredListCell>{item.owner || "Unassigned"}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell noWrap>Amount</StructuredListCell>
                <StructuredListCell>
                  {formatMoney(item.amountMinor, item.currency)}
                </StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell noWrap>Tags</StructuredListCell>
                <StructuredListCell>
                  {item.tags.length > 0 ? (
                    <span className={styles.tags}>
                      {item.tags.map((tag) => (
                        <Tag key={tag} type="gray">
                          {tag}
                        </Tag>
                      ))}
                    </span>
                  ) : (
                    "None"
                  )}
                </StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell noWrap>Done</StructuredListCell>
                <StructuredListCell>{item.done ? "Yes" : "No"}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell noWrap>Created</StructuredListCell>
                <StructuredListCell>{formatDate(item.createdAt)}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell noWrap>Updated</StructuredListCell>
                <StructuredListCell>{formatDate(item.updatedAt)}</StructuredListCell>
              </StructuredListRow>
            </StructuredListBody>
          </StructuredListWrapper>
        </>
      ) : null}
    </Modal>
  );
}
