import React, { useContext, useEffect } from 'react'
import { Button, AlertDialog, Flex } from '@radix-ui/themes'
import { ChatContext } from '@/components'

const AlertDialogModal = () => {
    const {
        isAlertDialogModalOpen: open,
        alertDialogModalSettings,
        closeAlertDialogModal
    } = useContext(ChatContext)


    return (
        <AlertDialog.Root open={open}>
            <AlertDialog.Content style={{ maxWidth: 450 }}>
                <AlertDialog.Title>{alertDialogModalSettings!.title}</AlertDialog.Title>
                <AlertDialog.Description size="2">
                    {alertDialogModalSettings!.description}
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray" onClick={closeAlertDialogModal}>
                            {alertDialogModalSettings!.cancelButtonText}
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button variant="solid" color="red" onClick={() => {
                            closeAlertDialogModal?.();
                            alertDialogModalSettings?.onSuccess?.();
                        }}>
                            {alertDialogModalSettings!.okButtonText}
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default AlertDialogModal

