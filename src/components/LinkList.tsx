"use client";
/* eslint-disable react/no-unescaped-entities */
import {
  CreateLinkInput,
  Link,
  UpdateLinkInput,
} from "@/interfaces/link.interface";
import { useLinkStore } from "@/stores/link.store";
import React, { useState, useEffect } from "react";
import Button from "./ui/Button";
import Image from "next/image";

const platforms = [
  "GitHub",
  "YouTube",
  "LinkedIn",
  "Facebook",
  "Frontend Mentor",
  ""
];

const LinkList = () => {
  const {
    links,
    addLink,
    updateLink,
    deleteLink,
    fetchLinks,
    loading,
    loadingSave,
  } = useLinkStore();
  const [newLinks, setNewLinks] = useState<CreateLinkInput[]>([]);
  const [editingLinks, setEditingLinks] = useState<UpdateLinkInput[]>([]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleAddLinkForm = () => {
    setNewLinks([...newLinks, { platform: "", url: "" }]);
  };

  const handleSaveLinks = async () => {
    const saveNewLinksPromises = newLinks
      .filter((link) => link.platform && link.url)
      .map((link) => addLink(link));

    const saveEditingLinksPromises = editingLinks
      .filter((link) => link.platform && link.url)
      .map((link) => updateLink(link));

    await Promise.all([...saveNewLinksPromises, ...saveEditingLinksPromises]);

    setNewLinks([]);
    setEditingLinks([]);
    fetchLinks(); // Refresh the list after saving
  };

  const handleChangeNew = (
    index: number,
    field: "platform" | "url",
    value: string
  ) => {
    const updatedLinks = newLinks.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setNewLinks(updatedLinks);
  };

  const handleRemoveNewLink = (index: number) => {
    setNewLinks(newLinks.filter((_, i) => i !== index));
  };

  const handleChangeEditing = (
    id: string,
    field: "platform" | "url",
    value: string
  ) => {
    const updatedLinks = editingLinks.map((link) =>
      link.id === id ? { ...link, [field]: value } : link
    );
    setEditingLinks(updatedLinks);
  };

  const handleEditLink = (link: Link) => {
    if (!editingLinks.find((editLink) => editLink.id === link.id)) {
      setEditingLinks([...editingLinks, { ...link }]);
    }
  };

  const handleDeleteLink = async (id: string) => {
    await deleteLink(id);
    fetchLinks(); // Refresh the list after deleting
  };

  const isSaveDisabled = () => {
    const hasInvalidNewLinks = newLinks.some(
      (link) => !link.platform || !link.url
    );
    const hasInvalidEditingLinks = editingLinks.some(
      (link) => !link.platform || !link.url
    );
    return hasInvalidNewLinks || hasInvalidEditingLinks || loadingSave;
  };

  return (
    <div className="bg-white">
      <div className="px-10 pt-10">
        <h2 className="font-bold text-[32px] text-[#333333] mb-2">
          Customize Your Links
        </h2>
        <p className="font-normal text-base text-[#737373] mb-10">
          Add/edit/remove links below and then share all your profiles with the
          world!
        </p>

        <Button
          variant="outline"
          className="flex items-center gap-2 w-full justify-center mb-6"
          onClick={handleAddLinkForm}
        >
          {/* <FaPlus /> */}
          Add New Link
        </Button>
      </div>

      <div className="px-10">
        {links.length === 0 && newLinks.length === 0 && (
          <div className="flex justify-center flex-col items-center bg-[#FAFAFA] py-16 lg:px-[100px] rounded-xl">
            <Image
              src="/images/Group 273.png"
              alt="vector"
              height={250}
              width={250}
              className="w-[249px]"
            />
            <h3 className="font-bold text-[32px] text-[#333333] pt-10 pb-6">
              Let's Get you Started
            </h3>
            <p className="font-normal text-base text-[#737373] text-center">
              Use the “Add new link” button to get started. Once you have more
              than one link, you can reorder and edit them. We’re here to help
              you share your profiles with everyone!
            </p>
          </div>
        )}
        <ul className="w-full">
          {links.map((link, index) => (
            <li
              key={link.id}
              className="flex flex-col mb-4 p-4 border border-gray-300 rounded"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg">Link #{index + 1}</span>
                <div className="flex">
                  <button
                    onClick={() => handleEditLink(link)}
                    className="text-indigo-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
              {editingLinks.find((editLink) => editLink.id === link.id) ? (
                <>
                  <label className="flex flex-col mb-2">
                    Platform
                    <select
                      value={
                        editingLinks.find((editLink) => editLink.id === link.id)
                          ?.platform || ""
                      }
                      onChange={(e) =>
                        handleChangeEditing(link.id, "platform", e.target.value)
                      }
                      className="p-2 mt-1 border border-gray-300 rounded"
                    >
                      <option value="" disabled>
                        Select platform
                      </option>
                      {platforms.map((platform) => (
                        <option key={platform} value={platform}>
                          {platform}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col">
                    Link
                    <input
                      type="text"
                      value={
                        editingLinks.find((editLink) => editLink.id === link.id)
                          ?.url || ""
                      }
                      onChange={(e) =>
                        handleChangeEditing(link.id, "url", e.target.value)
                      }
                      placeholder="e.g. https://www.example.com"
                      className="p-2 mt-1 border border-gray-300 rounded"
                    />
                  </label>
                </>
              ) : (
                <>
                  <label className="flex flex-col mb-2">
                    Platform
                    <input
                      type="text"
                      value={link.platform}
                      className="p-2 mt-1 border border-gray-300 rounded"
                      readOnly
                    />
                  </label>
                  <label className="flex flex-col">
                    Link
                    <input
                      type="text"
                      value={link.url}
                      className="p-2 mt-1 border border-gray-300 rounded"
                      readOnly
                    />
                  </label>
                </>
              )}
            </li>
          ))}
          {newLinks.map((link, index) => (
            <li
              key={index}
              className="flex flex-col mb-4 p-4 border border-gray-300 rounded"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg">
                  Link #{links.length + index + 1}
                </span>
                <button
                  onClick={() => handleRemoveNewLink(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
              <label className="flex flex-col mb-2">
                Platform
                <select
                  value={link.platform}
                  onChange={(e) =>
                    handleChangeNew(index, "platform", e.target.value)
                  }
                  className="p-2 mt-1 border border-gray-300 rounded"
                >
                  <option value="" disabled>
                    Select platform
                  </option>
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col">
                Link
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) =>
                    handleChangeNew(index, "url", e.target.value)
                  }
                  placeholder="e.g. https://www.example.com"
                  className="p-2 mt-1 border border-gray-300 rounded"
                />
              </label>
            </li>
          ))}
        </ul>
      </div>

      {(newLinks.length > 0 || editingLinks.length > 0) && (
        <button
          onClick={handleSaveLinks}
          className={`bg-indigo-600 text-white py-2 px-4 rounded mt-5 ${
            isSaveDisabled() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSaveDisabled()}
        >
          {loadingSave ? "Saving..." : "Save"}
        </button>
      )}
    </div>
  );
};

export default LinkList;
