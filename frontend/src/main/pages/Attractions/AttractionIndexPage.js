import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import AttractionTable from 'main/components/Attractions/AttractionTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function AttractionIndexPage() {

  const currentUser = useCurrentUser();

  const { data: attractions, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/attractions/all"],
      { method: "GET", url: "/api/attractions/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Attractions</h1>
        <AttractionTable attractions={attractions} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}