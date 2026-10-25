"use client";

import {
  Checkbox,
  Dropdown,
  Form,
  FormGroup,
  InlineNotification,
  Modal,
  Stack,
  TextArea,
  TextInput,
} from "@carbon/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  type ShowcaseItem,
  ShowcaseStatus,
} from "@/gen/erp/showcase/v1/showcase_pb";
import { showcaseClient } from "@/lib/connect";
import styles from "../design.module.scss";

type StatusOption = {
  id: string;
  label: string;
  value: ShowcaseStatus;
};

const statusOptions: StatusOption[] = [
  { id: "active", label: "Active", value: ShowcaseStatus.ACTIVE },
  { id: "on_hold", label: "On hold", value: ShowcaseStatus.ON_HOLD },
  { id: "archived", label: "Archived", value: ShowcaseStatus.ARCHIVED },
];

const defaultStatus = statusOptions[0];

function statusFor(value: ShowcaseStatus): StatusOption {
  return statusOptions.find((option) => option.value === value) ?? defaultStatus;
}

export function ShowcaseFormModal({
  open,
  item,
  onClose,
  onSaved,
}: {
  open: boolean;
  item: ShowcaseItem | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [owner, setOwner] = useState(item?.owner ?? "");
  const [amount, setAmount] = useState(item ? item.amountMinor.toString() : "0");
  const [currency, setCurrency] = useState(item?.currency || "USD");
  const [tags, setTags] = useState(item?.tags.join(", ") ?? "");
  const [done, setDone] = useState(item?.done ?? false);
  const [status, setStatus] = useState<StatusOption>(
    statusFor(item?.status ?? ShowcaseStatus.ACTIVE),
  );
  const [titleError, setTitleError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [tagsError, setTagsError] = useState("");

  const save = useMutation({
    mutationFn: async () => {
      const amountMinor = BigInt(amount.trim() || "0");
      const tagList = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        status: status.value,
        owner: owner.trim(),
        amountMinor,
        currency: currency.trim().toUpperCase(),
        tags: tagList,
        done,
      };
      if (item) {
        return showcaseClient.updateShowcaseItem({ id: item.id, ...payload });
      }
      return showcaseClient.createShowcaseItem(payload);
    },
    onSuccess: () => {
      onSaved(item ? "Showcase item updated." : "Showcase item created.");
    },
  });

  function submit() {
    const nextTitle = title.trim();
    const rawAmount = amount.trim() || "0";
    const tagList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const titleMessage = nextTitle ? "" : "Title is required.";
    const amountMessage = /^\d+$/.test(rawAmount)
      ? ""
      : "Use a whole number of minor units.";
    const tagsMessage =
      tagList.length > 6 ? "Use at most six tags." : "";
    setTitleError(titleMessage);
    setAmountError(amountMessage);
    setTagsError(tagsMessage);
    if (titleMessage || amountMessage || tagsMessage) return;
    if (!save.isPending) save.mutate();
  }

  return (
    <Modal
      open={open}
      modalHeading={item ? "Edit showcase item" : "Create showcase item"}
      primaryButtonText={save.isPending ? "Saving…" : "Save item"}
      primaryButtonDisabled={save.isPending}
      secondaryButtonText="Cancel"
      onRequestClose={() => {
        if (!save.isPending) onClose();
      }}
      onRequestSubmit={submit}
    >
      <Form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <Stack gap={7}>
          <FormGroup legendText="Record">
            <Stack gap={5}>
              <TextInput
                id="showcase-title"
                labelText="Title"
                value={title}
                invalid={Boolean(titleError)}
                invalidText={titleError}
                onChange={(event) => setTitle(event.target.value)}
              />
              <TextArea
                id="showcase-description"
                labelText="Description"
                value={description}
                rows={4}
                onChange={(event) => setDescription(event.target.value)}
              />
              <TextInput
                id="showcase-owner"
                labelText="Owner"
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
              />
            </Stack>
          </FormGroup>

          <FormGroup legendText="Details">
            <Stack gap={5}>
              <TextInput
                id="showcase-amount"
                labelText="Amount (minor units)"
                value={amount}
                invalid={Boolean(amountError)}
                invalidText={amountError}
                onChange={(event) => setAmount(event.target.value)}
              />
              <TextInput
                id="showcase-currency"
                labelText="Currency"
                value={currency}
                maxLength={3}
                onChange={(event) => setCurrency(event.target.value)}
              />
              <Dropdown
                id="showcase-status"
                titleText="Status"
                label="Choose a status"
                items={statusOptions}
                selectedItem={status}
                itemToString={(option) => (option ? option.label : "")}
                onChange={({ selectedItem }) => {
                  if (selectedItem) setStatus(selectedItem);
                }}
              />
              <TextInput
                id="showcase-tags"
                labelText="Tags"
                value={tags}
                invalid={Boolean(tagsError)}
                invalidText={tagsError}
                helperText="Comma-separated, up to six."
                onChange={(event) => setTags(event.target.value)}
              />
              <Checkbox
                id="showcase-done"
                labelText="Done"
                checked={done}
                onChange={(_event, { checked: next }) => setDone(next)}
              />
            </Stack>
          </FormGroup>

          {save.isError ? (
            <InlineNotification
              kind="error"
              title="Could not save the showcase item"
              subtitle={save.error.message}
            />
          ) : null}
          <p className={styles.note}>
            This form writes through the generated Connect client. The list
            refreshes after a successful save.
          </p>
        </Stack>
      </Form>
    </Modal>
  );
}
