"use client";

import { Modal } from "@heroui/react";

export default function FormModal({
  isOpen,
  setIsOpen,
  title,
  size = "sm:max-w-[520px]",
  children,
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className={size}>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{title}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              {children}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
